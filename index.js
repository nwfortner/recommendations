'use strict';

/**
 * This module exists to provide a startup routine
 * for Docker and provide a programmatic way to intialize
 * the server in tests.
 *
 * When running tests, the provision module should be
 * required and called manually in a "before" call
 */
const server = require('./server');
server.provision();
