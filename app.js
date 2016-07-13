'use strict';


const q = require('q');


const webserver = require('./backend/webserver/webserver'),
	logger = require('./backend/service/logger');


q.all([
	webserver.init()
]).done(
	() => logger.info('[main] Service initialized'),
	(error) => {
		logger.error('[main] Error during initialization: %s', error.stack);
		process.exit(1);
	}
);