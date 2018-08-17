const path = require('path');
const vueLoader = require('vue-loader');

module.exports = {
	components: 'src/components/**/[A-Z]*.vue',
	defaultExample: true,
	require: [path.join(__dirname, './src/style.scss')],
	ribbon: {
		url: 'https://github.com/vue-styleguidist/vue-styleguidist',
	},
	webpackConfig: {
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader',
					options: {
						loaders: {
							scss: [
								'vue-style-loader',
								'css-loader',
								{
									loader: 'sass-loader',
									options: {
										includePaths: ['./src'],
										data: '@import "style.scss";',
										outputStyle: 'compressed',
									},
								},
							],
						},
					},
				},
				{
					test: /\.js?$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
				},
				{
					test: /\.(css?|scss)(\?.*)?$/,
					loader: 'style-loader!css-loader!sass-loader',
				},
			],
		},
		plugins: [new vueLoader.VueLoaderPlugin()],
	},
	usageMode: 'expand',
	exampleMode: 'expand',
};
