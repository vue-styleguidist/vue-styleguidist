const { resolve } = require('path')
const { getWebpackConfig } = require('nuxt')

const FILTERED_PLUGINS = [
	'WebpackBarPlugin',
	'VueSSRClientPlugin',
	'HotModuleReplacementPlugin',
	'FriendlyErrorsWebpackPlugin',
	'HtmlWebpackPlugin'
]

const docSiteUrl = process.env.DEPLOY_PRIME_URL || 'https://vue-styleguidist.github.io'

/** @type import("vue-styleguidist").Config */
module.exports = async () => {
	// get the webpack config directly from nuxt
	const nuxtWebpackConfig = await getWebpackConfig('client')

	const webpackConfig = {
		module: {
			rules: [
				...nuxtWebpackConfig.module.rules.filter(
					// remove the eslint-loader
					a => a.loader !== 'eslint-loader'
				)
			]
		},
		resolve: { ...nuxtWebpackConfig.resolve },
		plugins: [
			...nuxtWebpackConfig.plugins.filter(
				// And some other plugins that could conflcit with ours
				p => FILTERED_PLUGINS.indexOf(p.constructor.name) === -1
			)
		]
	}

	return {
		components: './src/components/**/[A-Z]*.vue',
		renderRootJsx: resolve(__dirname, 'styleguide/styleguide.root.js'),
		ribbon: {
			text: 'Back to examples',
			url: `${docSiteUrl}/Examples.html`
		},
		webpackConfig,
		usageMode: 'expand',
		styleguideDir: 'dist'
	}
}
