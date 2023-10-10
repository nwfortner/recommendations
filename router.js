'use strict';

const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const {
  graphqlHTTP,
} = require('express-graphql');
const {
  graphqlErrorHandler,
} = require('./shared/errors');
const {
  graphqlContextFactory,
  printPublicSchema,
} = require('./shared/graphql');
const {
  useSession,
  ensureAccessKey,
  ensureLoggedIn,
} = require('./shared/middleware');
const schema = require('./schema');

const printedSchema = printPublicSchema(schema);

router.use(cookieParser());

// Set 'x-forwarded-for' header on local env
if ([process.env.local, process.env.test].includes(process.env.current)) {
  router.use((req, res, next) => {
    req.headers['x-forwarded-for'] = '127.0.0.1';
    next();
  });
}

router.use('/graphql', useSession, ensureLoggedIn, graphqlHTTP(async (req, res) => {
  const context = await graphqlContextFactory(req, res);
  return {
    schema,
    context,
    graphiql: process.env.current !== process.env.production,
    customFormatErrorFn: graphqlErrorHandler,
  };
}));

router.get('/service/schema', ensureAccessKey, (req, res) => {
  res.status(200).json({ schema: printedSchema });
});

module.exports = router;
