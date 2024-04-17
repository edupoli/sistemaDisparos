const pino = require('pino');

const logger = pino({ timestamp: () => `,"time":"${new Date().toJSON()}"` });

module.exports = logger;
