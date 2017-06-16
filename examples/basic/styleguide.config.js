const loaders = require('vue-webpack-loaders');
module.exports = {
	components: 'src/components/**/[A-Z]*.vue',
	defaultExample: true,
	webpackConfig: {
		module: {
			loaders,
		},
	},
	mixins: ['src/mixins/logger.js'],
	vuex: 'src/store/index.js',
};
