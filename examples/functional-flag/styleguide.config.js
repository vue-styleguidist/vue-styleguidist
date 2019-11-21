const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const vueLoader = require('vue-loader')
const path = require('path')

const docSiteUrl = process.env.DEPLOY_PRIME_URL || 'https://vue-styleguidist.github.io'

module.exports = {
	title: 'Vue Styleguidist functional',
	components: 'src/components/**/[A-Z]*.vue',
	ribbon: {
		text: 'Back to examples',
		url: `${docSiteUrl}/Examples.html`
	},
	version: '1.1.1',
	webpackConfig: {
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader'
				},
				{
					test: /\.js$/,
					loader: 'babel-loader',
					exclude: /(node_modules|packages)/,
					query: {
						cacheDirectory: true
					}
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader']
				}
			]
		},
		plugins: [new vueLoader.VueLoaderPlugin()].concat(
			process.argv.includes('--analyze') ? [new BundleAnalyzerPlugin()] : []
		)
	},
	// Override Styleguidist components
	styleguideComponents: {
		'ReactComponent/ReactComponent': path.join(__dirname, 'styleguide/components/ReactComponent'),
		'SectionHeading/SectionHeading': path.join(__dirname, 'styleguide/components/SectionHeading'),
		SectionHeadingRenderer: path.join(__dirname, 'styleguide/components/SectionHeadingRenderer'),
		ComponentsListRenderer: path.join(__dirname, 'styleguide/components/ComponentsListRenderer')
	},
	styleguideDir: 'dist'
}
