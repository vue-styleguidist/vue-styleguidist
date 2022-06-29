const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { defineConfig } = require('vue-styleguidist')

const docSiteUrl = process.env.DEPLOY_PRIME_URL || 'https://vue-styleguidist.github.io'

module.exports = defineConfig({
	// set your styleguidist configuration here
	title: 'Default Style Guide',
	defaultExample: true,
	components: 'src/components/**/[A-Z]*.vue',
	ribbon: {
		text: 'Back to examples',
		url: `${docSiteUrl}/Examples.html`
	},
	styleguideDir: 'dist',
	webpackConfig: {
		plugins: process.argv.includes('--analyze') ? [new BundleAnalyzerPlugin()] : []
	},
	codeSplit: true,
	minimize: false,
	skipComponentsWithoutExample: true
})
