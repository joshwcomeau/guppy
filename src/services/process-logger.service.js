const { LOGGING } = require('../config/app');
const winston = require('winston');
const { combine } = winston.format;

export const winstonLogger = winston.createLogger({
  format: combine(winston.format.splat(), winston.format.simple()),
  transports: [new winston.transports.Console()],
  silent: !LOGGING || process.env.NODE_ENV === 'production', // logging off or production
});

export const processLogger = (child, label, level = 'info') => {
  if (!child.stdout) {
    return; // needed for tests
  }

  // Todo: Handle color codes in logging to console (if supported). There are many control characters in the console output.
  child.stdout.on('data', data => {
    // data is an uint8 array --> decode to string
    winstonLogger.log(level, '[%s]: %s', label, data.toString());
  });

  child.stderr.on('data', data => {
    winstonLogger.log('error', '[%s]: %s', label, data.toString());
  });
};
