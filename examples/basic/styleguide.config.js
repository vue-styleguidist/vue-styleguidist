const vueLoader = require('vue-loader');

module.exports = {
	components: 'src/components/**/[A-Z]*.vue',
	defaultExample: true,
	ribbon: {
		url: 'https://github.com/vue-styleguidist/vue-styleguidist',
	},
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
					use: ['style-loader', 'css-loader'],
				},
			],
		},
		plugins: [new vueLoader.VueLoaderPlugin()],
	},
	showUsage: true,
	showCode: true,
};
