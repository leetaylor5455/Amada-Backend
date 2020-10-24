const logger = require('./loggerMiddleware');

module.exports = function(err, req, res, next) {
  logger.error(err.message);

  return res.status(500).send('Something went wrong.')
}