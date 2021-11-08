/*##############################################################################
# File: config.js                                                              #
# Project: chatbot-delivery                                                    #
# Created Date: 2021-08-11 16:03:40                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-08-12 10:01:45                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

//'use strict';
const dotenv = require('dotenv');
const assert = require('assert');

dotenv.config();

const {
    PORT,
    HOST,
    HTTPS,
    SSL_KEY_PATH,
    SSL_CERT_PATH,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    DB_HOSTNAME,
    DB_PORT,
    API_URL
} = process.env;

assert(PORT, 'PORT is required, please set the PORT variable value in the .env file');
assert(HOST, 'HOST is required, please set the HOST variable value in the .env file');
assert(DB_USERNAME, 'DB_USERNAME is required, please set the DB_USERNAME variable value in the .env file');
assert(DB_PASSWORD, 'DB_PASSWORD is required, please set the DB_PASSWORD variable value in the .env file');
assert(DB_NAME, 'DB_NAME is required, please set the DB_NAME variable value in the .env file');
assert(DB_HOSTNAME, 'DB_HOSTNAME is required, please set the DB_HOSTNAME variable value in the .env file');
assert(DB_PORT, 'DB_PORT is required, please set the DB_PORT variable value in the .env file');


module.exports = {
    port: PORT,
    host: HOST,
    https: HTTPS,
    ssl_key_path: SSL_KEY_PATH,
    ssl_cert_path: SSL_CERT_PATH,
    db_username: DB_USERNAME,
    db_password: DB_PASSWORD,
    db_port: DB_PORT,
    db_name: DB_NAME,
    db_hostname: DB_HOSTNAME,
    api_url: API_URL
}