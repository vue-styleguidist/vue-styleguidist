const loaders = require('vue-webpack-loaders');
module.exports = {
	components: 'src/components/**/[A-Z]*.vue',
	defaultExample: true,
	webpackConfig: {
		module: {
			loaders,
		},
	},
	serverPort: 6061,
	vuex: 'src/store/index.js',
};
