const { resolve } = require('path')
const { VueLoaderPlugin } = require('vue-loader')

const docSiteUrl = process.env.DEPLOY_PRIME_URL || 'https://vue-styleguidist.github.io'

function wait(time) {
	// eslint-disable-next-line compat/compat
	return new Promise(function(resolve) {
		setTimeout(resolve, time)
	})
}

module.exports = async () => {
	await wait(600)
	return {
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
}
