const path = require('path')
const vueLoader = require('vue-loader')

module.exports = {
	components: 'src/components/**/[A-Z]*.vue',
	defaultExample: true,
	template: {
		head: {
			links: [
				{
					href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons',
					rel: 'stylesheet'
				}
			]
		}
	},
	require: [
		path.join(__dirname, 'config/global.requires.js'),
		path.join(__dirname, 'config/global.styles.scss')
	],
	renderRootJsx: path.join(__dirname, 'config/styleguide.root.js'),
	webpackConfig: {
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader'
				},
				{
					test: /\.js?$/,
					exclude: /node_modules/,
					loader: 'babel-loader'
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader']
				},
				{
					test: /\.scss$/,
					use: ['style-loader', 'css-loader', 'sass-loader']
				}
			]
		},
		plugins: [new vueLoader.VueLoaderPlugin()]
	},
	usageMode: 'expand',
	exampleMode: 'expand',
	styleguideDir: 'dist',
	ribbon: {
		text: 'Back to examples',
		url: 'https://vue-styleguidist.github.io/Examples.html'
	}
}
