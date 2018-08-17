const path = require('path');
const vueLoader = require('vue-loader');

module.exports = {
	components: 'src/components/**/[A-Z]*.vue',
	defaultExample: true,
	ribbon: {
		url: 'https://github.com/vue-styleguidist/vue-styleguidist',
	},
	template: {
		head: {
			links: [
				{
					href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons',
					rel: 'stylesheet',
				},
			],
		},
	},
	require: [
		path.join(__dirname, 'config/global.requires.js'),
		path.join(__dirname, 'config/global.styles.scss'),
	],
	renderRootJsx: path.join(__dirname, 'config/styleguide.root.js'),
	webpackConfig: {
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader',
				},
				{
					test: /\.js?$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader', 'sass-loader'],
				},
				{
					test: /\.scss$/,
					use: ['style-loader', 'css-loader', 'sass-loader'],
				},
			],
		},
		plugins: [new vueLoader.VueLoaderPlugin()],
	},
	usageMode: 'expand',
	exampleMode: 'expand',
};
