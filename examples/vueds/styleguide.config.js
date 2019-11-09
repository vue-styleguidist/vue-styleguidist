const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const vueLoader = require('vue-loader')

module.exports = {
	title: 'Vue Design System',
	components: 'src/components/**/[A-Z]*.vue',
	version: require('./package.json').version,
	ribbon: {
		text: 'Back to examples',
		url: 'https://vue-styleguidist.github.io/Examples.html'
	},
	/**
	 * Enabling the following option splits sections into separate views.
	 */
	pagePerSection: true,
	simpleEditor: true,
	template: {
		title: 'Example — Vue Design System',
		lang: 'en',
		trimWhitespace: true,
		head: {
			meta: [
				{
					name: 'viewport',
					content: 'width=device-width,initial-scale=1.0'
				},
				{
					name: 'format-detection',
					content: 'telephone=no'
				}
			]
		}
	},
	/**
	 * remove the component pathline
	 */
	getComponentPathLine: () => '',
	/**
	 * load the vueds color scheme
	 */
	...require('./styleguide/vueds-theme'),
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
					exclude: /(node_modules|packages)/
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

		plugins: [new vueLoader.VueLoaderPlugin()].concat(
			process.argv.includes('--analyze') ? [new BundleAnalyzerPlugin()] : []
		)
	},
	/**
	 * We’re defining below JS and SCSS requires for the documentation.
	 */
	require: [path.join(__dirname, 'styleguide/loadfont.js')],
	/**
	 * Make sure sg opens with props and examples visible
	 */
	usageMode: 'expand',
	exampleMode: 'expand',
	styleguideComponents: {
		ReactComponentRenderer: path.join(__dirname, 'styleguide/components/ReactComponent'),
		PlaygroundRenderer: path.join(__dirname, 'styleguide/components/Playground')
	},
	styleguideDir: 'dist'
}
