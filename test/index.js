'use strict';

const server = require('../server');
const chai = require('chai');
const { expect } = chai;
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const nock = require('nock');
const mock = require('../shared/mocks');
const sinon = require('sinon').createSandbox();
const axios = require('axios');
const { port } = require('../shared/config');
const baseUrl = `http://localhost:${port}`;
const { Options, attachAxiosInterceptors } = require('../shared/graphql-test-setup');
const { setKill } = require('../workers/sqsConsumer/sqsConsumer.js');
attachAxiosInterceptors(axios);
Options.setUrl(`${baseUrl}/recommendations`);

// expose in all tests
global.expect = expect;
global.mock = mock;
global.Options = Options;
global.sinon = sinon;

before(async function () {
  this.timeout(4000);
  setKill(true);
  await server.provision();
});

afterEach(async () => {
  nock.cleanAll();
  sinon.restore();
  /**
   * Allows passing --save to prevent clearing all data
   */
  if (!process.argv.includes('save')) {
    // TODO: Add database teardown logic here
  }
});

after(async () => {
  // TODO: Add teardown logic here
  await server.httpServer?.close();
});

describe('Recommendations Service', function () {
  this.timeout(3000);
  describe('health check', () => {
    it('should return 204', async () => {
      const options = {
        url: `${baseUrl}/status`,
      };
      await axios(options).then(({ status }) => {
        expect(status).to.equal(204);
      })
      .catch((err) => {
        expect(err).to.be.null;
      });
    });
  });

  describe('Consumers', () => {
    require('./consumers/sqsConsumer.js');
  });

  describe('graphql Query', () => {
    require('./graphql/query.js');
  });
});
