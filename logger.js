/*##############################################################################
# File: logger.js                                                              #
# Project: sistema-de-disparos                                                 #
# Created Date: 2022-03-13 18:32:48                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-03-13 18:37:41                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

const { existsSync, mkdirSync } = require('fs');
const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const logDir = './logs';

if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

const logFormat = winston.format.printf(
  ({ timestamp, level, message, stack }) =>
    `${timestamp} ${level}: ${message} ${stack ? stack : ''}`
);

const dateFormat = 'YYYY-MM-DD';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: dateFormat + ' HH:mm:ss',
    }),
    logFormat
  ),
  transports: [
    new winstonDaily({
      level: 'debug',
      datePattern: dateFormat,
      dirname: `${logDir}/debug`,
      filename: `%DATE%.log`,
      maxFiles: 30,
      json: false,
      zippedArchive: true,
    }),
    new winstonDaily({
      level: 'error',
      datePattern: dateFormat,
      dirname: `${logDir}/error`,
      filename: `%DATE%.log`,
      maxFiles: 30,
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.colorize()
    ),
  })
);

exports.logger = logger;
