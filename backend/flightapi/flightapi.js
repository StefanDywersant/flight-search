'use strict';


const config = require('config').flightapi,
	moment = require('moment'),
	momentRange = require('moment-range'),
	q = require('q');


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
 * @typedef {{
 *  key: string,
 *  airline: Airline,
 *  flightNum: number,
 *  start: object,
 *  finish: object,
 *  plane: object,
 *  distance: number,
 *  durationMin: number,
 *  price: number
 * }} Flight
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


/**
 * Searches for a flight with given attributes.
 *
 * @param {string} airline Airline code
 * @param {string} from From airport code
 * @param {string} to To airport code
 * @param {date} date Date of flight
 * @returns {Promise.<Flight[]>}
 */
const flights = function(airline, from, to, date) {
	return request.get(
			config.base_path + '/flight_search/' + airline,
			{
				date: date.format('YYYY-MM-DD'),
				from: from,
				to: to
			}
		)
		.then((data) => JSON.parse(data));
};


/**
 * Searches for flights in given date range.
 *
 * @param {string} airline Airline code
 * @param {string} airportFrom From airport code
 * @param {string} airportTo To airport code
 * @param {Date} dateFrom Beginning date
 * @param {Date} dateTo End date
 * @returns {Promise.<Flight[]>}
 */
const flightsRange = function(airline, airportFrom, airportTo, dateFrom, dateTo) {
	const range = moment.range(dateFrom, dateTo);

	const requests = range.toArray('days')
		.map((date) => flights(airline, airportFrom, airportTo, date));

	return q.all(requests)
		.then((flightsArray) => {
			return flightsArray.reduce((all, flights) => all.concat(flights), [])
				.sort((flightA, flightB) => new Date(flightA.start.dateTime) > new Date(flightB.start.dateTime) ? 1 : -1);
		});
};


// public api
module.exports = {
	airlines,
	airports,
	flights,
	flightsRange
};