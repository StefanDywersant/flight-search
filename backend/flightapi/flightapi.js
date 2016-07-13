'use strict';


const config = require('config').flightapi;


const request = require('../service/request')(config);


/**
 * @typedef {{
 *  code: string,
 *  name: string
 * }} Airline
 */


/**
 * Returns available airlines list.
 *
 * @returns {Promise<Airline[]>}
 */
const airlines = function() {
	return request.get(config.base_path + '/airlines')
		.then((data) => JSON.parse(data));
};


// public api
module.exports = {
	airlines
};