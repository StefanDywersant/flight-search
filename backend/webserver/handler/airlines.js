'use strict';


const logger = require('../../service/logger'),
	flightapi = require('../../flightapi/flightapi');


const airlines = function(req, res) {
	return flightapi.airlines()
		.done(
			(airlines) => res.send(airlines),
			(error) => {
				logger.error('[webserver.handler.airlines] %s', error.stack);
				res.status(500).send(error.message)
			}
		);
};


module.exports = function(app) {
	app.get('/airlines', airlines);
};