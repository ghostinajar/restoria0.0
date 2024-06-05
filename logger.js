import winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, json, errors, printf, colorize } = winston.format;

// Define custom console format
const consoleFormat = printf(({ level, message, timestamp }) => {
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString('en-US', { hour12: false });
  return `${time} ${level}: ${message}`;
});

// Add colors for each level, apply the colors to winston
const colors = {
    error: 'red',
    warn: 'red',
    info: 'green',
    debug: 'cyan',
    comms: 'blue',
    loot: 'magenta',
    input: 'white',
    loadout: 'gray',
};
winston.addColors(colors);

// Create a transport for rotating file
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: './logs/logcombined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '56d',
});

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  comms: 4,
  loot: 5,
  input: 6,
  loadout: 7,
};

// Create a logger
const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    timestamp(),
    json()
  ),
  transports: [
    fileRotateTransport,
    // Apply the custom format only to the console transport
    new winston.transports.Console({
      format: combine(
        colorize(), // Apply color to the console output
        consoleFormat, // Use the custom console format
        errors({ stack: true }),
      )
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: './logs/exception.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: './logs/rejections.log' }),
  ],
});

export default logger;

/* 
import winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, json, errors } = winston.format;

// Create a transport to log to a file rotating daily and keep logs for 56 days
const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: './logs/logcombined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '56d',
});

const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    comms: 4,
    loot: 5,
    input: 6
};

// Create a logger with the configuration defined above 
const logger = winston.createLogger({
    levels: logLevels,
    level: 'info',
    format: combine(errors({ stack: true }), timestamp(), json()),
    transports: [
        fileRotateTransport, 
        new winston.transports.Console()
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: './logs/exception.log' }),
      ],
      rejectionHandlers: [
        new winston.transports.File({ filename: './logs/rejections.log' }),
      ],
});

export default logger;
*/