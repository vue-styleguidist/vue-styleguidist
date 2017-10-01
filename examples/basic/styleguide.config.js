const loaders = require('vue-webpack-loaders');
module.exports = {
	components: 'src/components/**/[A-Z]*.vue',
	defaultExample: true,
	webpackConfig: {
		module: {
			loaders,
		},
	},
	showUsage: true,
	serverPort: 6062,
	vuex: 'src/store/index.js',
};
