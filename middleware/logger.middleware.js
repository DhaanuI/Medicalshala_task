const { format } = require('winston');
const winston = require('winston');
require('winston-mongodb');
require("dotenv").config();

const logger = winston.createLogger({
    level: 'info', // Set the log level to include error, warning, and info
    format: format.combine(
        format.timestamp(),
        format.metadata(), // Enables metadata for each log entry
        format.printf(({ level, message, timestamp, metadata }) => {
            const { method, url } = metadata;
            return `[${timestamp}] [${level.toUpperCase()}] ${message} (Method: ${method}, URL: ${url})`;
        })
    ),
    transports: [
        new winston.transports.MongoDB({
            level: 'info', // Set the log level for the MongoDB transport to include error, warning, and info
            db: process.env.mongoURL,
            collection: 'logs', // Specify the collection name for the logs
            options: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        })
    ]
});

// Middleware to capture method and URL information
const logRequestDetails = (req, res, next) => {
    logger.defaultMeta = {
        method: req.method,
        url: req.originalUrl
    };
    next();
};



module.exports = { logger, logRequestDetails }
