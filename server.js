'use strict';

const createLogger = require('./shared/logger');
global.logger = createLogger();

const utils = require('./shared/utils');
const config = require('./shared/config');
const server = module.exports;
const router = require('./router.js');
const express = require('express');
const neo4j = require('neo4j-driver');
const {
  SQSClient,
} = require('@aws-sdk/client-sqs');
const {
  runSqsConsumer,
  setKill,
} = require('./workers/sqsConsumer/sqsConsumer.js');
const Recommendations = require('./interfaces/recommendations.js');

server.config = config.services.recommendations;

/**
 * The provisioner ensures that all dependent services
 * are up and running prior to attaching routes
 * and bringing the server online, also allows
 * tests to be ran independent of integrations
 */
const provision = async () => {
  if (config.env.current !== config.env.test) {
    // need to be able to reference this to remove in test env
    server.uncaughtExceptionListener = (err, origin) => {
      logger.fatal({
        err,
        origin,
      }, 'UncaughtException');
      process.exit(1);
    };

    process.on('uncaughtException', server.uncaughtExceptionListener);
  }

  // setup neo4j driver
  try {
    server.neo4j = neo4j
    .driver(
      config.neo4j.url,
      neo4j.auth.basic(config.neo4j.user, config.neo4j.password),
    );

    await server.neo4j.verifyConnectivity();
  } catch (err) {
    logger.error({
      err,
    }, 'Neo4j.connectionError');

    process.exit(1);
  }

  server.interfaces = {
    recommendations: new Recommendations({ neo4j: server.neo4j }),
  };

  // setup sqs client
  const sqsConfig = {};

  if (server.config.sqsQueueEndpoint && config.isTest) {
    sqsConfig.endpoint = server.config.sqsQueueEndpoint;
  }

  server.sqs = new SQSClient(sqsConfig);

  // run sqs Consumer
  if (!config.isTest) {
    runSqsConsumer(server.sqs, server.interfaces.recommendations);
  }

  // create app instance
  const app = server.app = express();

  // health check. the only route
  app.get('/status', (req, res) => res.sendStatus(204));

  app.use('/recommendations', router);

  // boot up the server
  server.httpServer = await utils.loadServer(app);

  // be sure to close all open connections once server closes socket
  server.httpServer.once('close', async () => {
    // TODO: Add any teardown logic httpServer
    setKill(true);
    await Promise.all([server.neo4j.close()]);
  });
};

process.on('SIGTERM', () => {
  // stop accepting incoming traffic and drain the server
  server?.httpServer?.close();
});

exports.provision = provision;
