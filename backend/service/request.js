'use strict';


const http = require('http'),
	q = require('q'),
	logger = require('./logger');


module.exports = function(config) {
	const get = function(path) {
		const deferred = q.defer(),
			hostname = config.hostname,
			port = config.port,
			startTime = Date.now();

		logger.silly('[requests:get] Request http://' + hostname + path);

		const request = http.request({
			host: hostname,
			path: path,
			port: port
		}, function(response) {
			logger.silly('[requests:get] Response http://%s:%d%s (%d, %dms)', hostname, port, path, response.statusCode, (Date.now() - startTime));

			if (response.statusCode != 200) {
				deferred.reject('Invalid status: ' + response.statusCode);
				return;
			}

			let str = '';

			response.on('data', function (chunk) {
				str += chunk;
			});

			response.on('end', function () {
				deferred.resolve(str);
			});
		});

		request.on('error', function(error) {
			logger.error('[requests:get] Error while processing http://%s:%d%s: %s', hostname, port, path, error);
			deferred.reject(error);
		});

		request.end();

		return deferred.promise;
	};


	// public api
	return {get: get};
};