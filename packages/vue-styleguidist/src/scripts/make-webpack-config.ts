import * as path from 'path'
import * as fs from 'fs'
import webpack, { Configuration } from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { MiniHtmlWebpackPlugin } from 'mini-html-webpack-plugin'
import MiniHtmlWebpackTemplate from '@vxna/mini-html-webpack-template'
import merge from 'webpack-merge'
import forEach from 'lodash/forEach'
import isFunction from 'lodash/isFunction'
import makeWebpackConfig from 'react-styleguidist/lib/scripts/make-webpack-config'
import StyleguidistOptionsPlugin from 'react-styleguidist/lib/scripts/utils/StyleguidistOptionsPlugin'
import { SanitizedStyleguidistConfig } from '../types/StyleGuide'
import mergeWebpackConfig from './utils/mergeWebpackConfig'

const RENDERER_REGEXP = /Renderer$/

const sourceDir = path.resolve(__dirname, '../client')

export default function (
	config: SanitizedStyleguidistConfig,
	env: 'development' | 'production' | 'none'
): Configuration {
	process.env.NODE_ENV = process.env.NODE_ENV || env
	const isProd = env === 'production'

	const template = isFunction(config.template) ? config.template : MiniHtmlWebpackTemplate
	const templateContext = isFunction(config.template) ? {} : config.template
	const htmlPluginOptions: ConstructorParameters<typeof MiniHtmlWebpackPlugin>[0] = {
		context: Object.assign({}, templateContext, {
			title: config.title,
			container: config.mountPointId,
			trimWhitespace: true
		}),
		template
	}

	let webpackConfig: Configuration = {
		output: {
			path: config.styleguideDir,
			filename: 'build/[name].bundle.js',
			chunkFilename: 'build/[name].js'
		},
		resolve: {
			extensions: ['.vue', '.js', '.jsx', '.json'],
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

	const vue$ = 'vue/dist/vue.esm.js'

	webpackConfig = merge(webpackConfig, {
		// we need to follow our own entry point
		entry: config.require.concat([path.resolve(sourceDir, 'index')]),
		resolve: {
			alias: {
				// allows to use the compiler
				// without this, cli will overload the alias and use runtime esm
				vue$
			}
		},
		plugins: [
			// in order to avoid collision with the preload plugins
			// that are loaded by the vue cli
			// we have to load these plugins last
			new StyleguidistOptionsPlugin(config as any),
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
		const optimization: Configuration['optimization'] = config.minimize
			? {
					minimizer: [
						new TerserPlugin({
							parallel: true,
							terserOptions: {
								ie8: false,
								ecma: 5,
								compress: {
									keep_fnames: true,
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
				new CleanWebpackPlugin({
					verbose: config.verbose === true
				}),
				// only add plugin if assetsDir is specified
				...(config.assetsDir
					? [
							new CopyWebpackPlugin({
								patterns: [config.assetsDir]
							})
					  ]
					: [])
			],
			optimization
		})
	} else {
		webpackConfig = merge(
			{
				output: {
					publicPath: config.styleguidePublicPath
				},
				plugins: [
					new webpack.HotModuleReplacementPlugin(),
					new webpack.ProvidePlugin({
						// Webpack 5 does no longer include a polyfill for this Node.js variable.
						// https://webpack.js.org/migrate/5/#run-a-single-build-and-follow-advice
						process: 'process/browser'
					})
				],
				entry: [require.resolve('react-dev-utils/webpackHotDevClient')]
			},
			webpackConfig
		)
	}

	const RSG_COMPONENTS_ALIAS = 'rsg-components'
	const RSG_COMPONENTS_ALIAS_DEFAULT = `${RSG_COMPONENTS_ALIAS}-default`

	const vsgAliases: Record<string, string | false | string[]> = {}

	// Custom style guide components have priority over vsg components
	if (config.styleguideComponents) {
		forEach(config.styleguideComponents, (filepath, name) => {
			const fullName = name.match(RENDERER_REGEXP)
				? `${name.replace(RENDERER_REGEXP, '')}/${name}`
				: name
			vsgAliases[`${RSG_COMPONENTS_ALIAS}/${fullName}`] = filepath
		})
	}

	// vue-styleguidist overridden components
	const sourceSrc = path.resolve(sourceDir, RSG_COMPONENTS_ALIAS)
	fs.readdirSync(sourceSrc).forEach((component: string) => {
		vsgAliases[`${RSG_COMPONENTS_ALIAS}/${component}`] = path.resolve(sourceSrc, component)
		// plus in order to avoid cirular references, add an extra ref to the defaults
		// so that custom components can reference their defaults
		vsgAliases[`${RSG_COMPONENTS_ALIAS_DEFAULT}/${component}`] =
			vsgAliases[`${RSG_COMPONENTS_ALIAS}/${component}`]
	})

	// For some components, the alias model is a little more complicated,
	// because we only override a part of the directory
	const custComp = [
		'slots/UsageTabButton',
		'ReactComponent/ReactComponent',
		'StyleGuide/StyleGuideRenderer'
	]

	const userCustomComponents = config.styleguideComponents || {}
	const customComponents: { [originalPath: string]: string } = custComp.reduce(
		(acc: { [originalPath: string]: string }, comp) => {
			// unless the component is a user custom component
			const compParts = comp.split('/')
			if (
				!userCustomComponents[comp] &&
				!userCustomComponents[compParts[0]] &&
				!userCustomComponents[compParts[1]]
			) {
				// set the alias to the prefixed Vsg folder instead of the Rsg original folder
				// This allows Vsg to use Rsg version of the component without conflicts but still
				// wrap it in a renderer specific to vue
				// NOTE: it is only useful if we don't want to copy the component over and only customize the renderer
				acc[comp] = `Vsg${comp}`
			}
			return acc
		},
		{}
	)

	if (config.codeSplit) {
		customComponents['Playground/Playground'] = 'PlaygroundAsync/PlaygroundAsync'
	}

	customComponents.Preview = path.join('Preview', config.codeSplit ? 'PreviewAsync' : 'Preview')

	const buildEditorComponentChain = (cc: { [originalPath: string]: string }) => {
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

	Object.keys(customComponents).forEach(function (key) {
		vsgAliases[`${RSG_COMPONENTS_ALIAS}/${key}`] = path.resolve(sourceSrc, customComponents[key])

		vsgAliases[`${RSG_COMPONENTS_ALIAS_DEFAULT}/${key}`] =
			vsgAliases[`${RSG_COMPONENTS_ALIAS}/${key}`]
	})

	// Add components folder alias at the end so users can override our components to customize the style guide
	// (their aliases should be before this one)
	const resolve = makeWebpackConfig(config as any, env).resolve
	if (resolve && resolve.alias) {
		if (Array.isArray(resolve.alias)) {
			vsgAliases[RSG_COMPONENTS_ALIAS] =
				resolve.alias.find(alias => alias.name === RSG_COMPONENTS_ALIAS)?.alias ?? false
		} else {
			vsgAliases[RSG_COMPONENTS_ALIAS] = resolve.alias[RSG_COMPONENTS_ALIAS]
		}
	}

	// To avoid circular rendering when overriding existing components,
	// Create another alias, not overriden by users
	if (config.styleguideComponents) {
		vsgAliases[RSG_COMPONENTS_ALIAS_DEFAULT] = vsgAliases[RSG_COMPONENTS_ALIAS]
	}

	const webpackAlias = webpackConfig.resolve && webpackConfig.resolve.alias

	if (Array.isArray(webpackAlias)) {
		Object.entries(vsgAliases).forEach(([name, alias]) => {
			webpackAlias.push({
				name,
				alias
			})
		})
	} else if (typeof webpackAlias === 'object') {
		Object.entries(vsgAliases).forEach(([name, alias]) => {
			webpackAlias[name] = alias
		})
	}

	if (config.dangerouslyUpdateWebpackConfig) {
		webpackConfig = config.dangerouslyUpdateWebpackConfig(webpackConfig, env)
	}

	return webpackConfig
}
