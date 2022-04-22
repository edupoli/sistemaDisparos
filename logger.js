/*##############################################################################
# File: logger.js                                                              #
# Project: sistema-de-disparos                                                 #
# Created Date: 2022-03-13 18:32:48                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-03-13 18:37:41                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/
//logger.js
const winston = require('winston');
const dir = './logs';

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: `${dir}/error.log`,
      level: 'error',
    }),
    new winston.transports.File({ filename: `${dir}/info.log`, level: 'info' }),
  ],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  })
);

exports.logger = logger;
