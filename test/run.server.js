const path = require('path');
// eslint-disable-next-line import/no-unresolved
const cypress = require('cypress');
const styleguidist = require('../scripts');

/* eslint-disable no-console */

const dir = path.resolve(__dirname, '../examples', process.argv[2] || 'basic');
const config = require(path.join(dir, 'styleguide.config'));

config.logger = {
	info: console.log,
	warn: message => console.warn(`Warning: ${message}`),
};

config.components = path.resolve(dir, 'src/components/**/[A-Z]*.vue');

delete config.ribbon;
delete config.usageMode;
delete config.exampleMode;

const { app } = styleguidist(config).server((err, config) => {
	if (err) {
		console.log(err);
	} else {
		cypress.run().then(() => {
			app.close();
		});
	}
});
