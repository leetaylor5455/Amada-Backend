global.__basedir = __dirname;

const express = require('express');
const app = express();

const logger = require('./middleware/logger');
require('./startup/logging.js')();

require('./startup/config')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();

// PORT
const port = process.env.PORT || 3000
const server = app.listen(port, () => logger.info(`Listening on port ${port}...`));

module.exports = server;