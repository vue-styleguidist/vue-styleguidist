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
	theme: {
		maxWidth: 'auto',
		color: {
			sidebarBackground: '#02172d',
			border: 'rgba(255, 255, 255, 0.1)',
			link: '#258aef',
			linkHover: '#1070d1',
			/**
			 * prism colors configuration
			 */
			codeComment: '#6d6d6d',
			codePunctuation: '#54a3f2',
			codeProperty: '#54a3f2',
			codeString: '#ffcc4d',
			codeInserted: '#EEEEEE',
			codeOperator: '#DDDDDD',
			codeKeyword: '#afe74c',
			codeFunction: '#54a3f2',
			codeVariable: '#AAAAAA',
			codeBase: '#FFFFFF',
			codeBackground: '#041d37'
		},
		sidebarWidth: 240,
		fontFamily: {
			base: ["'Fira Sans'", 'Helvetica', 'Arial', 'sans-serif'],
			monospace: ['Consolas', "'Liberation Mono'", 'Menlo', 'monospace']
		},
		fontSize: {
			h4: '18px'
		}
	},
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
	styles: require('./styleguide/styles'),
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
