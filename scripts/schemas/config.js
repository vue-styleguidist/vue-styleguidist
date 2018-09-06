// If you want to access any of these options in React, don’t forget to update CLIENT_CONFIG_OPTIONS array
// in loaders/styleguide-loader.js

const DEFAULT_COMPONENTS_PATTERN = `src/{components,Components}/**/*.vue`;

const path = require('path');
const startCase = require('lodash/startCase');
const kleur = require('kleur');
const logger = require('glogg')('rsg');
const fileExistsCaseInsensitive = require('react-styleguidist/scripts/utils/findFileCaseInsensitive');
const getUserPackageJson = require('react-styleguidist/scripts/utils/getUserPackageJson');
const StyleguidistError = require('react-styleguidist/scripts/utils/error');
const findUserWebpackConfig = require('../utils/findUserWebpackConfig');
const consts = require('../consts');

module.exports = {
	assetsDir: {
		type: 'existing directory path',
		example: 'assets',
	},
	compilerConfig: {
		type: 'object',
		default: {
			objectAssign: 'Object.assign',
		},
	},
	// `components` is a shortcut for { sections: [{ components }] },
	// see `sections` below
	components: {
		type: ['string', 'function', 'array'],
		example: 'components/**/[A-Z]*.vue',
	},
	configDir: {
		process: (value, config, rootDir) => rootDir,
	},
	context: {
		type: 'object',
		default: {},
		example: {
			map: 'lodash/map',
		},
	},
	contextDependencies: {
		type: 'array',
	},
	configureServer: {
		type: 'function',
	},
	dangerouslyUpdateWebpackConfig: {
		type: 'function',
	},
	defaultExample: {
		type: ['boolean', 'existing file path'],
		default: false,
		process: val =>
			val === true ? path.resolve(__dirname, '../templates/DefaultExample.md') : val,
	},
	exampleMode: {
		type: 'string',
		process: (value, config) => {
			return config.showCode === undefined ? value : config.showCode ? 'expand' : 'collapse';
		},
		default: 'collapse',
	},
	getComponentPathLine: {
		type: 'function',
		default: componentPath => componentPath,
	},
	getExampleFilename: {
		type: 'function',
		default: componentPath => {
			const files = [
				path.join(path.dirname(componentPath), 'Readme.md'),
				componentPath.replace(path.extname(componentPath), '.md'),
			];

			for (const file of files) {
				const existingFile = fileExistsCaseInsensitive(file);
				if (existingFile) {
					return existingFile;
				}
			}

			return false;
		},
		example: componentPath => componentPath.replace(/\.jsx?$/, '.examples.md'),
	},
	ignore: {
		type: 'array',
		default: ['**/__tests__/**', `**/*.test.vue`, `**/*.spec.vue`, '**/*.d.ts'],
	},
	highlightTheme: {
		type: 'string',
		default: 'base16-light',
		deprecated: 'Use the theme property in the editorConfig option instead',
	},
	editorConfig: {
		type: 'object',
		process: (value, config) => {
			const defaults = {
				theme: 'base16-light',
				mode: 'jsx',
				lineWrapping: true,
				smartIndent: false,
				matchBrackets: true,
				viewportMargin: Infinity,
				lineNumbers: false,
			};
			return Object.assign(
				{},
				defaults,
				config.highlightTheme && {
					theme: config.highlightTheme,
				},
				value
			);
		},
	},
	navigation: {
		type: 'boolean',
		default: false,
		deprecated: 'Use pagePerSection option instead',
	},
	mixins: {
		type: 'array',
		default: [],
		example: ['path/to/mixin.js', 'path/to/created.js'],
		deprecated: 'Use renderRootJsx option instead',
	},
	logger: {
		type: 'object',
	},
	mountPointId: {
		type: 'string',
		default: 'rsg-root',
	},
	pagePerSection: {
		type: 'boolean',
		default: false,
	},
	previewDelay: {
		type: 'number',
		default: 500,
	},
	printBuildInstructions: {
		type: 'function',
	},
	printServerInstructions: {
		type: 'function',
	},
	propsParser: {
		type: 'function',
	},
	require: {
		type: 'array',
		default: [],
		example: ['babel-polyfill', 'path/to/styles.css'],
	},
	renderRootJsx: {
		type: 'directory path',
	},
	ribbon: {
		type: 'object',
		example: {
			url: 'http://example.com/',
			text: 'Fork me on GitHub',
		},
	},
	sections: {
		type: 'array',
		default: [],
		process: (val, config) => {
			if (!val) {
				// If root `components` isn't empty, make it a first section
				// If `components` and `sections` weren’t specified, use default pattern
				const components = config.components || DEFAULT_COMPONENTS_PATTERN;
				return [
					{
						components,
					},
				];
			}
			return val;
		},
		example: [
			{
				name: 'Documentation',
				content: 'Readme.md',
			},
			{
				name: 'Components',
				components: './lib/components/**/[A-Z]*.js',
			},
		],
	},
	serverHost: {
		type: 'string',
		default: '0.0.0.0',
	},
	serverPort: {
		type: 'number',
		default: 6060,
	},
	showCode: {
		type: 'boolean',
		default: false,
		deprecated: 'Use exampleMode option instead',
	},
	showUsage: {
		type: 'boolean',
		default: false,
		deprecated: 'Use usageMode option instead',
	},
	showSidebar: {
		type: 'boolean',
		default: true,
	},
	skipComponentsWithoutExample: {
		type: 'boolean',
		default: false,
	},
	sortProps: {
		type: 'function',
	},
	styleguideComponents: {
		type: 'object',
	},
	styleguideDir: {
		type: 'directory path',
		default: 'styleguide',
	},
	styleguidePublicPath: {
		type: 'string',
		default: '',
	},
	styles: {
		type: 'object',
		default: {},
		example: {
			Logo: {
				logo: {
					fontStyle: 'italic',
				},
			},
		},
	},
	template: {
		type: ['object', 'function'],
		default: {},
		process: val => {
			if (typeof val === 'string') {
				throw new StyleguidistError(
					`${kleur.bold(
						'template'
					)} config option format has been changed, you need to update your config.`,
					'template'
				);
			}
			return val;
		},
	},
	theme: {
		type: 'object',
		default: {},
		example: {
			link: 'firebrick',
			linkHover: 'salmon',
		},
	},
	title: {
		type: 'string',
		process: val => {
			if (val) {
				return val;
			}
			const name = getUserPackageJson().name || '';
			return `${startCase(name)} Style Guide`;
		},
		example: 'My Style Guide',
	},
	updateDocs: {
		type: 'function',
	},
	updateExample: {
		type: 'function',
		default: props => {
			if (props.lang === 'example') {
				props.lang = 'js';
				logger.warn(
					'"example" code block language is deprecated. Use "js", "jsx" or "javascript" instead:\n' +
						consts.DOCS_DOCUMENTING
				);
			}
			return props;
		},
	},
	updateWebpackConfig: {
		type: 'function',
		removed: `Use "webpackConfig" option instead:\n${consts.DOCS_WEBPACK}`,
	},
	usageMode: {
		type: 'string',
		process: (value, config) => {
			return config.showUsage === undefined ? value : config.showUsage ? 'expand' : 'collapse';
		},
		default: 'collapse',
	},
	verbose: {
		type: 'boolean',
		default: false,
	},
	version: {
		type: 'string',
	},
	vuex: {
		type: 'directory path',
		deprecated: 'Use renderRootJsx option instead',
	},
	webpackConfig: {
		type: ['object', 'function'],
		process: val => {
			if (val) {
				return val;
			}

			const file = findUserWebpackConfig();
			if (file) {
				logger.info(`Loading webpack config from:\n${file}`);
				// eslint-disable-next-line import/no-dynamic-require
				return require(file);
			}

			logger.warn(
				'No webpack config found. ' +
					'You may need to specify "webpackConfig" option in your style guide config:\n' +
					consts.DOCS_WEBPACK
			);

			return undefined;
		},
		example: {
			module: {
				rules: [
					{
						test: /\.vue$/,
						exclude: /node_modules/,
						loader: 'vue-loader',
						options: {},
					},
					{
						test: /\.js$/,
						exclude: /node_modules/,
						loader: 'babel-loader',
					},
					{
						test: /\.css$/,
						loader: 'style-loader!css-loader',
					},

					{
						test: /\.json$/,
						loader: 'json-loader',
					},
					{
						exclude: [/\.html$/, /\.(js|jsx)$/, /\.css$/, /\.vue$/, /\.json$/],
						loader: 'url-loader',
						query: {
							limit: 10000,
							name: 'static/media/[name].[hash:8].[ext]',
						},
					},
				],
			},
		},
	},
};
