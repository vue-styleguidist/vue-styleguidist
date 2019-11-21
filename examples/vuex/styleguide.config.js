const path = require('path')
const vueLoader = require('vue-loader')

const docSiteUrl = process.env.DEPLOY_PRIME_URL || 'https://vue-styleguidist.github.io'

module.exports = {
	components: 'src/components/**/[A-Z]*.vue',
	simpleEditor: true,
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
					use: ['style-loader', 'css-loader', 'sass-loader']
				},
				{
					test: /\.scss$/,
					use: ['style-loader', 'css-loader', 'sass-loader']
				}
			]
		},
		plugins: [new vueLoader.VueLoaderPlugin()]
	},
	renderRootJsx: path.join(__dirname, 'config/styleguide.root.js'),
	usageMode: 'expand',
	styleguideDir: 'dist',
	ribbon: {
		text: 'Back to examples',
		url: `${docSiteUrl}/Examples.html`
	}
}
