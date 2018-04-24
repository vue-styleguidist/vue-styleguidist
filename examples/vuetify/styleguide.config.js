const path = require('path');

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
	renderRootJsx: previewComponent => {
		// https://vuejs.org/v2/guide/render-function.html
		return {
			render(createElement) {
				return createElement(
					'v-app',
					{
						props: {
							id: 'v-app',
						},
					},
					[createElement(Object.assign(previewComponent))]
				);
			},
		};
	},
	webpackConfig: {
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader',
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
	},
	showUsage: true,
	showCode: true,
};
