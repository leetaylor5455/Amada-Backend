const logger = require('../middleware/loggerMiddleware');
require('winston-mongodb');

module.exports = function() {
    process.on('uncaughtException', (ex) => {
        logger.error(ex.message);
        //process.exit(1);
    });
      
    process.on('unhandledRejection', (reason, promise) => {
        logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
        //process.exit(1);
    });
}