'use strict';


const logger = require('../../service/logger'),
	flightapi = require('../../flightapi/flightapi');


const airports = function(req, res) {
	return flightapi.airports(req.params.query)
		.done(
			(airports) => res.send(airports),
			(error) => {
				logger.error('[webserver.handler.airports] %s', error.stack);
				res.status(500).send(error.message)
			}
		);
};


module.exports = function(app) {
	app.get('/airports/:query', airports);
};