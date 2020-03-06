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
		resolve: {
			extensions: ['.ts', '.js', '.vue']
		},
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
					test: /\.tsx?$/,
					loader: 'ts-loader',
					exclude: /node_modules/,
					options: {
						appendTsSuffixTo: [/\.vue$/]
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
