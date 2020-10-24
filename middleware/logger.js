const { createLogger, format, transports } = require("winston");
require('winston-mongodb');
const { combine, timestamp, label, printf } = format;
const config = require('config');

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const options = {
    file: {
        info: {
            level: "info",
            filename: `${__basedir}/logs/combined.log`,
            handleExceptions: true,
            handleRejections: true,
            json: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: true,
            timestamp: true,
        },
        error: {
            level: "error",
            filename: `${__basedir}/logs/error.log`,
            handleExceptions: true,
            handleRejections: true,
            json: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: true,
            timestamp: true,
        },    
    },
    console: {
        level: "info",
        handleExceptions: true,
        handleRejections: true,
        json: true,
        colorize: true,
    },
};

const mongoDBOptions = { 
    db: config.get('db'),
    level: 'error',
    options: { useUnifiedTopology: true } 
};

const logger = createLogger({
    format: combine(
        label({ label: this.level }), 
        timestamp(), 
        logFormat
    ),
    transports: [
        new transports.Console({ colorize: true, prettyPrint: true }), 
        new transports.File(options.file.info),
        new transports.File(options.file.error), 
        //new transports.MongoDB(mongoDBOptions)
    ]
});

module.exports = logger;