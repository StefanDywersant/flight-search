'use strict';


const moment = require('moment'),
	config = require('config').webserver.handler.flights;


const logger = require('../../service/logger'),
	flightapi = require('../../flightapi/flightapi');


const flights = function(req, res) {
	return flightapi.flightsRange(
			req.params.airline,
			req.query.from,
			req.query.to,
			moment(req.query.date, 'YYYY-MM-DD').subtract(config.add_days, 'days'),
			moment(req.query.date, 'YYYY-MM-DD').add(config.subtract_days, 'days')
		)
		.done(
			(flights) => res.send(flights),
			(error) => {
				logger.error('[webserver.handler.flights] %s', error.stack);
				res.status(500).send(error.message)
			}
		);
};


module.exports = function(app) {
	app.get('/flight_search/:airline', flights);
};