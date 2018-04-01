const { resolve } = require('path');
const rules = require('vue-webpack-loaders');
const vueLoaderConfig = require('vue-webpack-loaders/lib/vue-loader.conf');

rules.push({
	// eslint-disable-next-line
	test: /vue-awesome[\\\/]components[\\\/]Icon\.vue$/,
	loader: 'vue-loader',
	options: vueLoaderConfig,
});

module.exports = {
	require: [
		'babel-polyfill',
		'eventsource-polyfill',
		'promise.prototype.finally',
		'./config/styleguide.mock.js',
	],
	components: '../src/components/**/[A-Z]*.vue',
	webpackConfig: {
		resolve: {
			extensions: ['.js', '.json', '.vue', '.ts'],
			alias: {
				'~': resolve(__dirname, '..', 'src'),
				'@': resolve(__dirname, '..', 'src'),
			},
		},
		module: {
			rules,
		},
	},
	showUsage: true,
};
