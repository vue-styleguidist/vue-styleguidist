const loaders = require('vue-webpack-loaders');
module.exports = {
	components: 'src/components/**/[A-Z]*.vue',
	defaultExample: true,
	webpackConfig: {
		module: {
			loaders,
		},
	},
	vuex: 'examples/basic/src/store/index.js',
};
