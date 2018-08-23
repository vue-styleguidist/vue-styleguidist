const path = require('path');
const vueLoader = require('vue-loader');

module.exports = {
	components: 'src/components/**/[A-Z]*.vue',
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
	renderRootJsx: path.join(__dirname, 'config/styleguide.root.js'),
	usageMode: 'expand',
};
