const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')
const vueLoader = require('vue-loader')

const docSiteUrl = process.env.DEPLOY_PRIME_URL || 'https://vue-styleguidist.github.io'

module.exports = {
	title: 'Style guide example',
	components: 'src/components/**/[A-Z]*.vue',
	showSidebar: false,
	jssThemedEditor: false,
	require: ['./styleguide/vsc-prism.css'],
	ribbon: {
		text: 'Back to examples',
		url: `${docSiteUrl}/Examples.html`
	},
	theme: './styleguide/theme.js',
	styles: './styleguide/styles.js',
	getComponentPathLine(componentPath) {
		const name = path.basename(componentPath, '.js')
		return `import { ${name} } from 'my-awesome-library';`
	},

	// Example of overriding the CLI message in local development.
	// Uncomment/edit the following `serverHost` entry to see in output
	// serverHost: 'your-domain',
	printServerInstructions(config) {
		// eslint-disable-next-line no-console
		console.log(`View your styleguide at: http://${config.serverHost}:${config.serverPort}`)
	},

	// Override Styleguidist components
	styleguideComponents: {
		LogoRenderer: path.join(__dirname, 'styleguide/components/Logo'),
		StyleGuideRenderer: path.join(__dirname, 'styleguide/components/StyleGuide'),
		SectionsRenderer: path.join(__dirname, 'styleguide/components/SectionsRenderer')
	},
	webpackConfig: {
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader'
				},
				{
					test: /\.js?$/,
					loader: 'babel-loader',
					exclude: /(node_modules|packages)/,
					query: {
						cacheDirectory: true
					}
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader', 'sass-loader']
				},
				{
					test: /\.scss$/,
					use: ['style-loader', 'css-loader', 'sass-loader']
				},
				{
					test: /\.png$/,
					use: ['url-loader']
				}
			]
		},
		plugins: [new vueLoader.VueLoaderPlugin()].concat(
			process.argv.includes('--analyze') ? [new BundleAnalyzerPlugin()] : []
		),
		resolve: {
			alias: {
				'@mixins': path.resolve(__dirname, './src/mixins'),
				// Make sure the example uses the local version of react-styleguidist
				// This is only for the examples in this repo, you won't need it for your own project
				'vue-styleguidist': path.join(__dirname, '../../')
			}
		}
	},
	usageMode: 'expand',
	exampleMode: 'expand',
	styleguideDir: 'dist'
}
