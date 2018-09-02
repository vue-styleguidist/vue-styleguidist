const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin');
const MiniHtmlWebpackTemplate = require('@vxna/mini-html-webpack-template');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const forEach = require('lodash/forEach');
const isFunction = require('lodash/isFunction');
const StyleguidistOptionsPlugin = require('react-styleguidist/scripts/utils/StyleguidistOptionsPlugin');
const getWebpackVersion = require('react-styleguidist/scripts/utils/getWebpackVersion');
const mergeWebpackConfig = require('./utils/mergeWebpackConfig');
const mergeWebpackConfigVueCLI = require('./utils/mergeWebpackConfigVueCLI');
const existsVueCLI = require('./utils/existsVueCLI');
const makeWebpackConfig = require('react-styleguidist/scripts/make-webpack-config');

const RENDERER_REGEXP = /Renderer$/;

const isWebpack4 = getWebpackVersion() >= 4;
const sourceDir = path.resolve(__dirname, '../lib');

module.exports = function(config, env) {
	process.env.NODE_ENV = process.env.NODE_ENV || env;
	const isProd = env === 'production';

	const template = isFunction(config.template) ? config.template : MiniHtmlWebpackTemplate;
	const templateContext = isFunction(config.template) ? {} : config.template;
	const htmlPluginOptions = {
		context: Object.assign({}, templateContext, {
			title: config.title,
			container: config.mountPointId,
			trimWhitespace: true,
		}),
		template,
	};

	let webpackConfig = {
		output: {
			path: config.styleguideDir,
			filename: 'build/[name].bundle.js',
			chunkFilename: 'build/[name].js',
		},
		resolve: {
			extensions: ['.js', '.jsx', '.json'],
			alias: {
				'rsg-codemirror-theme.css': `codemirror/theme/${config.editorConfig.theme}.${'css'}`,
			},
		},
		module: {
			rules: [
				{
					resourceQuery: /blockType=docs/,
					loader: require.resolve('../loaders/docs-loader.js'),
				},
			],
		},
		performance: {
			hints: false,
		},
	};

	/* istanbul ignore if */
	if (isWebpack4) {
		webpackConfig.mode = env;
	}

	if (config.webpackConfig) {
		if (existsVueCLI()) {
			webpackConfig = mergeWebpackConfigVueCLI(webpackConfig, config.webpackConfig, env);
		} else {
			webpackConfig = mergeWebpackConfig(webpackConfig, config.webpackConfig, env);
		}
	}

	webpackConfig = merge(webpackConfig, {
		// we need to follow our own entry point
		entry: config.require.concat([path.resolve(sourceDir, 'index')]),
		resolve: {
			alias: {
				// allows to use the compiler
				// without this, cli will overload the alias and use runtime esm
				vue$: 'vue/dist/vue.esm.js',
			},
		},
		plugins: [
			// in order to avoid collision with the preload plugins
			// that are loaded by the vue cli
			// we have to load these plugins last
			new StyleguidistOptionsPlugin(config),
			new MiniHtmlWebpackPlugin(htmlPluginOptions),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
				'process.env.STYLEGUIDIST_ENV': JSON.stringify(env),
			}),
		],
	});

	// To have the hot-reload work on vue-styleguide
	// the HMR has to be loaded after the html plugin.
	// Hence this piece added last to the list of plugins.
	if (isProd) {
		webpackConfig = merge(webpackConfig, {
			output: {
				filename: 'build/bundle.[chunkhash:8].js',
				chunkFilename: 'build/[name].[chunkhash:8].js',
				publicPath: config.styleguidePublicPath,
			},
			plugins: [
				new CleanWebpackPlugin(['build'], {
					root: config.styleguideDir,
					verbose: config.verbose === true,
				}),
				new CopyWebpackPlugin(
					config.assetsDir
						? [
								{
									from: config.assetsDir,
								},
						  ]
						: []
				),
			],
		});

		const uglifier = new UglifyJSPlugin({
			parallel: true,
			cache: true,
			uglifyOptions: {
				ie8: false,
				ecma: 5,
				compress: {
					keep_fnames: true,
					warnings: false,
				},
				mangle: {
					keep_fnames: true,
				},
			},
		});

		/* istanbul ignore if */
		if (isWebpack4) {
			webpackConfig.optimization = {
				minimizer: [uglifier],
			};
		} else {
			webpackConfig.plugins.unshift(uglifier);
		}
	} else {
		webpackConfig = merge(webpackConfig, {
			entry: [require.resolve('react-dev-utils/webpackHotDevClient')],
			plugins: [new webpack.HotModuleReplacementPlugin()],
		});
	}

	// Custom style guide components
	if (config.styleguideComponents) {
		forEach(config.styleguideComponents, (filepath, name) => {
			const fullName = name.match(RENDERER_REGEXP)
				? `${name.replace(RENDERER_REGEXP, '')}/${name}`
				: name;
			webpackConfig.resolve.alias[`rsg-components/${fullName}`] = filepath;
		});
	}

	const sourceSrc = path.resolve(sourceDir, 'rsg-components');

	[
		'Preview',
		'Usage',
		'Events',
		'Props',
		'Table',
		'SlotsTable',
		'slots/UsageTabButton',
		'StyleGuide',
		'Welcome',
	].forEach(function(component) {
		webpackConfig.resolve.alias[`rsg-components/${component}`] = path.resolve(sourceSrc, component);
	});

	// Add components folder alias at the end so users can override our components to customize the style guide
	// (their aliases should be before this one)
	webpackConfig.resolve.alias['rsg-components'] = makeWebpackConfig(config, env).resolve.alias[
		'rsg-components'
	];

	if (config.dangerouslyUpdateWebpackConfig) {
		webpackConfig = config.dangerouslyUpdateWebpackConfig(webpackConfig, env);
	}

	return webpackConfig;
};
