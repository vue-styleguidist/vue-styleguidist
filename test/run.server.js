const path = require('path');
const vueLoader = require('vue-loader');
const styleguidist = require('../scripts');

/* eslint-disable no-console */

const dir = path.resolve(__dirname, '../examples/basic/src');

styleguidist({
	components: path.resolve(dir, 'components/**/[A-Z]*.vue'),
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
	logger: {
		info: console.log,
		warn: message => console.warn(`Warning: ${message}`),
	},
	serverPort: 8082,
}).server((err, config) => {
	if (err) {
		console.log(err);
	} else {
		console.log('Listening at http://' + config.serverHost + ':' + config.serverPort);
	}
});
