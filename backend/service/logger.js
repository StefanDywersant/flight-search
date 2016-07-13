'use strict';


const winston = require('winston'),
	config = require('config').logger;


module.exports = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({
			colorize: true,
			level: config.level,
			timestamp: true,
			label: (process.pid + '')
		})
	]
});

