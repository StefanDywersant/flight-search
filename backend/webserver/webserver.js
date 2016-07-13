'use strict';


const http = require('http'),
	q = require('q'),
	express = require('express'),
	config = require('config').webserver,
	winstonRequestLogger = require('winston-request-logger');


const logger = require('../service/logger'),
	airlinesHandler = require('./handler/airlines'),
	airportsHandler = require('./handler/airports');


/**
 * Webserver instance holder
 */
let _instance;


// Configuration of webserver instance
{
	const app = express();

	// attach requests logger
	app.use(winstonRequestLogger.create(logger, {
		ip: ':ip',
		status: ':statusCode',
		method: ':method',
		url: ':url[pathname]',
		responseTime: ':responseTimems',
		message: '[webserver:static]'
	}));

	// serve static content from frontend/ directory
	app.use('/', express.static(__dirname + '/../../frontend/'));

	// attach handlers
	airlinesHandler(app);
	airportsHandler(app);

	// create configured webserver instance
	_instance = http.createServer(app);
}


/**
 * Initializes webserver instance.
 *
 * @returns {Promise.boolean}
 */
const init = function() {
	_instance.listen(config.port, config.host);
	logger.info('[webserver:init] Webserver listening on %s:%d', config.host, config.port);
	return q(true);
};


/**
 * Returns configured webserver instance
 *
 * @returns {object}
 */
const instance = () => _instance;


// public api
module.exports = {init, instance};