const { resolve } = require('path');
const rules = require('vue-webpack-loaders');

module.exports = {
	components: 'src/components/**/[A-Z]*.vue',
	webpackConfig: {
		resolve: {
			extensions: ['.js', '.json', '.vue', '.ts'],
			alias: {
				'~': resolve(__dirname, 'src'),
				'@': resolve(__dirname, 'src'),
			},
		},
		module: {
			rules,
		},
	},
	showUsage: true,
	vuex: './src/store/index',
};
