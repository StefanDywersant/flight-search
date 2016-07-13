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
 * @typedef {{
 *  airportCode: string,
 *  airportName: string,
 *  cityCode: string,
 *  cityName: string,
 *  countryCode: string,
 *  countryName: string,
 *  latitude: number,
 *  longitude: number,
 *  stateCode: string,
 *  timeZone: string
 * }} Airport
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


/**
 * Returns airports matching given query.
 *
 * @returns {Promise<Airport[]>}
 */
const airports = function(query) {
	return request.get(config.base_path + '/airports', {q: query})
		.then((data) => JSON.parse(data));
};


// public api
module.exports = {
	airlines,
	airports
};