const path = require('path')
const vueLoader = require('vue-loader')

module.exports = {
	title: 'Style guide example',
	components: 'src/components/**/[A-Z]*.vue',
	showSidebar: false,
	theme: {
		baseBackground: '#fdfdfc',
		link: '#274e75',
		linkHover: '#90a7bf',
		border: '#e0d2de',
		font: ['Helvetica', 'sans-serif']
	},
	styles: {
		Playground: {
			preview: {
				paddingLeft: 0,
				paddingRight: 0,
				borderWidth: [[0, 0, 1, 0]],
				borderRadius: 0
			}
		},
		Markdown: {
			pre: {
				border: 0,
				background: 'none'
			},
			code: {
				fontSize: 14
			}
		}
	},
	getComponentPathLine(componentPath) {
		const name = path.basename(componentPath, '.js')
		return `import { ${name} } from 'my-awesome-library';`
	},

	// Example of overriding the CLI message in local development.
	// Uncomment/edit the following `serverHost` entry to see in output
	// serverHost: 'your-domain',
	printServerInstructions(config) {
		// eslint-disable-next-line no-console
		console.log(`View your styleguide at: http://localhost:${config.serverPort}`)
	},

	// Override Styleguidist components
	styleguideComponents: {
		LogoRenderer: path.join(__dirname, 'styleguide/components/Logo'),
		StyleGuideRenderer: path.join(__dirname, 'styleguide/components/StyleGuide')
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
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
							plugins: [
								'@babel/plugin-transform-runtime',
								'@babel/plugin-transform-react-jsx',
								'transform-vue-jsx'
							],
							comments: false
						}
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
		plugins: [new vueLoader.VueLoaderPlugin()],
		resolve: {
			alias: {
				'@mixins': path.resolve(__dirname, './src/mixins')
			}
		}
	},
	editorConfig: {
		keyMap: 'sublime'
	},
	usageMode: 'expand',
	exampleMode: 'expand'
}
