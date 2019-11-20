const { resolve } = require('path')
const { VueLoaderPlugin } = require('vue-loader')

const docSiteUrl = process.env.DEPLOY_PRIME_URL || 'https://vue-styleguidist.github.io'

module.exports = {
	components: './src/components/**/[A-Z]*.vue',
	renderRootJsx: resolve(__dirname, 'styleguide/styleguide.root.js'),
	ribbon: {
		text: 'Back to examples',
		url: `${docSiteUrl}/Examples.html`
	},
	webpackConfig: {
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader'
				},
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: require('./babel.config')
					}
				},
				{
					test: /\.css$/,
					use: ['vue-style-loader', 'css-loader']
				}
			]
		},
		plugins: [new VueLoaderPlugin()]
	},
	usageMode: 'expand',
	styleguideDir: 'dist'
}
