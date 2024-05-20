import winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, json, errors } = winston.format;

// Create a transport to log to a file rotating daily and keep logs for 56 days
const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: 'combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '56d',
});

const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
    comm: 5,
    loot: 6
};

// Create a logger with the configuration defined above 
const logger = winston.createLogger({
    levels: logLevels,
    level: process.env.LOG_LEVEL || 'info',
    format: combine(errors({ stack: true }), timestamp(), json()),
    transports: [
        fileRotateTransport, 
        new winston.transports.Console()
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'exception.log' }),
      ],
      rejectionHandlers: [
        new winston.transports.File({ filename: 'rejections.log' }),
      ],
});

export default logger;
