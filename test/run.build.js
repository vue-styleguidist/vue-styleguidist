const styleguidist = require('../packages/vue-styleguidist/scripts');

/* eslint-disable no-console */

styleguidist(require('../examples/basic/styleguide.config.js')).build((err, config) => {
	if (err) {
		console.log(err);
	} else {
		console.log('Style guide published to', config.styleguideDir);
	}
});
