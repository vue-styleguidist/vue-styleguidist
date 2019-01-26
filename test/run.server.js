const path = require('path');
const vueLoader = require('vue-loader');
const styleguidist = require('../scripts');

/* eslint-disable no-console */

const dir = path.resolve(__dirname, '../examples/basic');
const config = require(path.join(dir, 'styleguide.config'));

config.logger = {
	info: console.log,
	warn: message => console.warn(`Warning: ${message}`),
};

config.serverPort = 8082;
config.components = path.resolve(dir, 'src/components/**/[A-Z]*.vue');

styleguidist(config).server((err, config) => {
	if (err) {
		console.log(err);
	} else {
		console.log('Listening at http://' + config.serverHost + ':' + config.serverPort);
	}
});
