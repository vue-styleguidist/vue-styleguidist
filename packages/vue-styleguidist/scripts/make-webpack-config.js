const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin')
const MiniHtmlWebpackTemplate = require('@vxna/mini-html-webpack-template')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require('webpack-merge')
const forEach = require('lodash/forEach')
const isFunction = require('lodash/isFunction')
const StyleguidistOptionsPlugin = require('react-styleguidist/lib/scripts/utils/StyleguidistOptionsPlugin')
const mergeWebpackConfig = require('./utils/mergeWebpackConfig')
const makeWebpackConfig = require('react-styleguidist/lib/scripts/make-webpack-config')

const RENDERER_REGEXP = /Renderer$/

const sourceDir = path.resolve(__dirname, '../lib')

module.exports = function(config, env) {
	process.env.NODE_ENV = process.env.NODE_ENV || env
	const isProd = env === 'production'

	const template = isFunction(config.template) ? config.template : MiniHtmlWebpackTemplate
	const templateContext = isFunction(config.template) ? {} : config.template
	const htmlPluginOptions = {
		context: Object.assign({}, templateContext, {
			title: config.title,
			container: config.mountPointId,
			trimWhitespace: true
		}),
		template
	}

	let webpackConfig = {
		output: {
			path: config.styleguideDir,
			filename: 'build/[name].bundle.js',
			chunkFilename: 'build/[name].js'
		},
		resolve: {
			extensions: ['.js', '.jsx', '.json'],
			alias: {
				'rsg-codemirror-theme.css': `codemirror/theme/${
					config.editorConfig.theme.split(' ')[0]
				}.css`
			}
		},
		module: {
			rules: [
				{
					resourceQuery: /blockType=docs/,
					loader: require.resolve('../loaders/docs-loader.js')
				}
			]
		},
		performance: {
			hints: false
		}
	}

	webpackConfig.mode = env

	if (config.webpackConfig) {
		webpackConfig = mergeWebpackConfig(webpackConfig, config.webpackConfig, env)
	}

	webpackConfig = merge(webpackConfig, {
		// we need to follow our own entry point
		entry: config.require.concat([path.resolve(sourceDir, 'index')]),
		resolve: {
			alias: {
				// allows to use the compiler
				// without this, cli will overload the alias and use runtime esm
				vue$: require.resolve('vue/dist/vue.esm.js')
			}
		},
		plugins: [
			// in order to avoid collision with the preload plugins
			// that are loaded by the vue cli
			// we have to load these plugins last
			new StyleguidistOptionsPlugin(config),
			new MiniHtmlWebpackPlugin(htmlPluginOptions),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
				'process.env.STYLEGUIDIST_ENV': JSON.stringify(env)
			})
		]
	})

	// To have the hot-reload work on vue-styleguide
	// the HMR has to be loaded after the html plugin.
	// Hence this piece added last to the list of plugins.
	if (isProd) {
		const optimization = config.minimize
			? {
					minimizer: [
						new TerserPlugin({
							parallel: true,
							cache: true,
							terserOptions: {
								ie8: false,
								ecma: 5,
								compress: {
									keep_fnames: true,
									warnings: false,
									/**
									 * Disable reduce_funcs to keep Terser from inlining
									 * Preact's VNode. If enabled, the 'new VNode()' is replaced
									 * with a anonymous 'function(){}', which is problematic for
									 * preact-compat, since it extends the VNode prototype to
									 * accomodate React's API.
									 */
									reduce_funcs: false
								},
								mangle: {
									keep_fnames: true
								}
							}
						})
					]
			  }
			: { minimize: false }
		webpackConfig = merge(webpackConfig, {
			output: {
				filename: 'build/bundle.[chunkhash:8].js',
				chunkFilename: 'build/[name].[chunkhash:8].js',
				publicPath: config.styleguidePublicPath
			},
			plugins: [
				new CleanWebpackPlugin(['build'], {
					root: config.styleguideDir,
					verbose: config.verbose === true
				}),
				new CopyWebpackPlugin(
					config.assetsDir
						? [
								{
									from: config.assetsDir
								}
						  ]
						: []
				)
			],
			optimization
		})
	} else {
		webpackConfig = merge(webpackConfig, {
			plugins: [new webpack.HotModuleReplacementPlugin()],
			output: {
				publicPath:
					webpackConfig.output && webpackConfig.output.publicPath
						? webpackConfig.output.publicPath
						: config.styleguidePublicPath
			},
			devServer: {
				publicPath:
					webpackConfig.devServer && webpackConfig.devServer.publicPath
						? webpackConfig.devServer.publicPath
						: config.styleguidePublicPath
			},
			entry: [require.resolve('react-dev-utils/webpackHotDevClient')]
		})
	}

	const RSG_COMPONENTS_ALIAS = 'rsg-components'
	const RSG_COMPONENTS_ALIAS_DEFAULT = `${RSG_COMPONENTS_ALIAS}-default`

	const webpackAlias = webpackConfig.resolve.alias

	// vue-styleguidist overridden components
	const sourceSrc = path.resolve(sourceDir, RSG_COMPONENTS_ALIAS)
	require('fs')
		.readdirSync(sourceSrc)
		.forEach(function(component) {
			webpackAlias[`${RSG_COMPONENTS_ALIAS}/${component}`] = path.resolve(sourceSrc, component)
			// plus in order to avoid cirular references, add an extra ref to the defaults
			// so that custom components can reference their defaults
			webpackAlias[`${RSG_COMPONENTS_ALIAS_DEFAULT}/${component}`] =
				webpackAlias[`${RSG_COMPONENTS_ALIAS}/${component}`]
		})

	// For some components, the alias model is a little more complicated,
	// because we only override a part of the directory
	const custComp = [
		'slots/UsageTabButton',
		'ReactComponent/ReactComponent',
		'StyleGuide/StyleGuideRenderer'
	]
	const customComponents = custComp.reduce(function(acc, comp) {
		acc[comp] = `Vsg${comp}`
		return acc
	}, {})

	if (config.codeSplit) {
		customComponents['Playground/Playground'] = 'PlaygroundAsync/PlaygroundAsync'
	}

	customComponents.Preview = path.join('Preview', config.codeSplit ? 'PreviewAsync' : 'Preview')

	const buildEditorComponentChain = cc => {
		let key = 'Editor'

		// avoid codesplitting tiny prism only spli heavy codemirror
		if (config.codeSplit && !config.simpleEditor) {
			cc[key] = 'EditorAsync'
			key = 'EditorStatic'
		}

		// adapt compiled/raw format neede for precompiled preview
		if (config.codeSplit) {
			cc[key] = 'EditorPrecompiled'
			key = 'EditorString'
		}

		// add codebutton if asked for
		if (config.copyCodeButton) {
			cc[key] = 'EditorWithToolbar'
			key = 'EditorNoTools'
		}

		// if the user chose prism, load the prism editor instead of codemirror
		cc[key] = path.join('VsgEditor', config.simpleEditor ? 'EditorPrism' : 'Editor')
	}

	buildEditorComponentChain(customComponents)

	Object.keys(customComponents).forEach(function(key) {
		webpackAlias[`${RSG_COMPONENTS_ALIAS}/${key}`] = path.resolve(sourceSrc, customComponents[key])

		webpackAlias[`${RSG_COMPONENTS_ALIAS_DEFAULT}/${key}`] =
			webpackAlias[`${RSG_COMPONENTS_ALIAS}/${key}`]
	})

	// Custom style guide components
	if (config.styleguideComponents) {
		forEach(config.styleguideComponents, (filepath, name) => {
			const fullName = name.match(RENDERER_REGEXP)
				? `${name.replace(RENDERER_REGEXP, '')}/${name}`
				: name
			webpackAlias[`${RSG_COMPONENTS_ALIAS}/${fullName}`] = filepath
		})
	}

	// Add components folder alias at the end so users can override our components to customize the style guide
	// (their aliases should be before this one)
	webpackAlias[RSG_COMPONENTS_ALIAS] = makeWebpackConfig(config, env).resolve.alias[
		RSG_COMPONENTS_ALIAS
	]

	// To avoid circular rendering when overriding existing components,
	// Create another alias, not overriden by users
	if (config.styleguideComponents) {
		webpackAlias[RSG_COMPONENTS_ALIAS_DEFAULT] = webpackAlias[RSG_COMPONENTS_ALIAS]
	}

	if (config.dangerouslyUpdateWebpackConfig) {
		webpackConfig = config.dangerouslyUpdateWebpackConfig(webpackConfig, env)
	}

	return webpackConfig
}
