'use strict';


const q = require('q'),
	cluster = require('cluster'),
	os = require('os'),
	config = require('config');


const webserver = require('./backend/webserver/webserver'),
	logger = require('./backend/service/logger');


if (cluster.isMaster) {
	// determine how many nodes will be spawned
	const childsNo = config.cluster.childs == 'auto'
		? os.cpus().length
		: config.cluster.childs;

	// spawn nodes
	for (let i = 0; i < childsNo; i++) {
		cluster.fork();
	}

	logger.info('[main] Child nodes spawned');
} else {
	// child node code

	q.all([
		webserver.init()
	]).done(
		() => logger.info('[main] Service initialized'),
		(error) => {
			logger.error('[main] Error during initialization: %s', error.stack);
			process.exit(1);
		}
	);
}