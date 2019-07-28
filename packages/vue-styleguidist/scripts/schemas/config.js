// If you want to access any of these options in React, don’t forget to update CLIENT_CONFIG_OPTIONS array
// in loaders/styleguide-loader.js

const DEFAULT_COMPONENTS_PATTERN = `src/{components,Components}/**/*.vue`

const path = require('path')
const startCase = require('lodash/startCase')
const kleur = require('kleur')
const logger = require('glogg')('vsg')
const fileExistsCaseInsensitive = require('react-styleguidist/lib/scripts/utils/findFileCaseInsensitive')
const getUserPackageJson = require('react-styleguidist/lib/scripts/utils/getUserPackageJson')
const StyleguidistError = require('react-styleguidist/lib/scripts/utils/error')
const findUserWebpackConfig = require('../utils/findUserWebpackConfig')
const consts = require('../consts')

const MODES = ['collapse', 'expand', 'hide'].map(m => ({ value: m, name: m }))

module.exports = {
	assetsDir: {
		uitype: 'string',
		message: 'Assets Directory',
		description:
			'Your application static assets folder, will be accessible as / in the style guide dev server.',
		type: 'existing directory path',
		example: 'assets'
	},
	codeSplit: {
		default: false,
		message: 'Code Split',
		description:
			'Should the styleguide try code splitting for better performance? NOte that you will need the proper transform in your babel config',
		type: 'boolean'
	},
	compilerConfig: {
		type: 'object',
		default: {
			objectAssign: 'Object.assign'
		}
	},
	// `components` is a shortcut for { sections: [{ components }] },
	// see `sections` below
	components: {
		uitype: 'string',
		message: 'Components',
		description:
			'Where to find the components. Takes in a String or an Array of glob paths. Comma separated.',
		type: ['string', 'function', 'array'],
		example: 'components/**/[A-Z]*.vue'
	},
	configDir: {
		process: (value, config, rootDir) => rootDir
	},
	context: {
		type: 'object',
		default: {},
		example: {
			map: 'lodash/map'
		}
	},
	contextDependencies: {
		type: 'array'
	},
	configureServer: {
		type: 'function'
	},
	copyCodeButton: {
		type: 'boolean',
		message: 'Easily copy the code of the example',
		description:
			'Add a button on the top right of the code sections to copy to clipboard the current contents of the editor',
		default: false
	},
	dangerouslyUpdateWebpackConfig: {
		type: 'function'
	},
	defaultExample: {
		uitype: 'boolean',
		message: 'Default Example',
		description:
			"Display each component with a default example, regardless of if there's a README or <docs/> block written.",
		type: ['boolean', 'existing file path'],
		default: false,
		process: val => (val === true ? path.resolve(__dirname, '../templates/DefaultExample.md') : val)
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
				lineNumbers: false
			}
			return Object.assign(
				{},
				defaults,
				config.highlightTheme && {
					theme: config.highlightTheme
				},
				value
			)
		}
	},
	exampleMode: {
		message: 'Example Mode',
		description: 'Defines the initial state of the props and methods tab',
		list: MODES,
		type: 'string',
		process: (value, config) => {
			return config.showCode === undefined ? value : config.showCode ? 'expand' : 'collapse'
		},
		default: 'collapse'
	},
	getComponentPathLine: {
		type: 'function',
		default: componentPath => componentPath
	},
	getExampleFilename: {
		type: 'function',
		default: componentPath => {
			const files = [
				path.join(path.dirname(componentPath), 'Readme.md'),
				componentPath.replace(path.extname(componentPath), '.md')
			]

			for (const file of files) {
				const existingFile = fileExistsCaseInsensitive(file)
				if (existingFile) {
					return existingFile
				}
			}

			return false
		},
		example: componentPath => componentPath.replace(/\.jsx?$/, '.examples.md')
	},
	highlightTheme: {
		type: 'string',
		default: 'base16-light',
		deprecated: 'Use the theme property in the editorConfig option instead'
	},
	ignore: {
		uitype: 'string',
		message: 'Ignore',
		description: 'What components to ignore. Can be an Array or String. Comma separated.',
		type: 'array',
		default: ['**/__tests__/**', `**/*.test.vue`, `**/*.spec.vue`, '**/*.d.ts']
	},
	jsxInComponents: {
		message: 'JSX in Components',
		description:
			'Do documented components contain JSX syntax? Set this to `false` to restore compatibility with this TypeScript cast syntax: `<any>variable` instead of `variable as any`.',
		type: 'boolean',
		default: true
	},
	jsxInExamples: {
		message: 'JSX in Markdown Examples [BETA]',
		description:
			'Will allow exmaples to contain JSX syntax. You will have to use proper Vue component format in examples. No pseudo JSX.',
		type: 'boolean',
		default: false
	},
	locallyRegisterComponents: {
		message: 'Locally register components',
		description: 'Register components on their examples only instead of globally Vue.components()',
		type: 'boolean',
		default: false
	},
	navigation: {
		type: 'boolean',
		default: false,
		deprecated: 'Use pagePerSection option instead'
	},
	mixins: {
		type: 'array',
		default: [],
		example: ['path/to/mixin.js', 'path/to/created.js'],
		deprecated: 'Use renderRootJsx option instead'
	},
	logger: {
		type: 'object'
	},
	minimize: {
		type: 'boolean',
		default: true,
		message: 'Minimize Built Styleguide',
		description:
			'If this option is set to false, the styelguidist will not minimize the js at build.'
	},
	mountPointId: {
		message: 'Mount Point ID',
		description: 'The ID of a DOM element where Styleguidist mounts.',
		type: 'string',
		default: 'rsg-root'
	},
	pagePerSection: {
		message: 'Page Per Section',
		description:
			'Render one section or component per page. If true, each section will be a single page.',
		type: 'boolean',
		default: false
	},
	previewDelay: {
		type: 'number',
		default: 500
	},
	printBuildInstructions: {
		type: 'function'
	},
	printServerInstructions: {
		type: 'function'
	},
	propsParser: {
		type: 'function'
	},
	require: {
		type: 'array',
		default: [],
		example: ['babel-polyfill', 'path/to/styles.css']
	},
	renderRootJsx: {
		type: 'directory path'
	},
	ribbon: {
		uitype: 'boolean',
		message: 'Ribbon',
		description:
			"Shows 'Fork Me' ribbon in the top-right corner. If ribbon key is present, then it's required to add url property; text property is optional. If you want to change styling of the ribbon, please, refer to the theme section in the documentation.",
		type: 'object',
		example: {
			url: 'http://example.com/',
			text: 'Fork me on GitHub'
		}
	},
	sections: {
		type: 'array',
		default: [],
		process: (val, config) => {
			if (!val) {
				// If root `components` isn't empty, make it a first section
				// If `components` and `sections` weren’t specified, use default pattern
				const components = config.components || DEFAULT_COMPONENTS_PATTERN
				return [
					{
						components
					}
				]
			}
			return val
		},
		example: [
			{
				name: 'Documentation',
				content: 'Readme.md'
			},
			{
				name: 'Components',
				components: './lib/components/**/[A-Z]*.js'
			}
		]
	},
	serverHost: {
		message: 'Server Host',
		description: 'Dev server host name',
		type: 'string',
		default: '0.0.0.0'
	},
	serverPort: {
		uitype: 'string',
		message: 'Server Port',
		description: 'Dev server port',
		type: ['number', 'string'],
		default: 6060
	},
	showCode: {
		type: 'boolean',
		default: false,
		deprecated: 'Use exampleMode option instead'
	},
	showUsage: {
		type: 'boolean',
		default: false,
		deprecated: 'Use usageMode option instead'
	},
	showSidebar: {
		message: 'Show Sidebar',
		description:
			'Toggle sidebar visibility. Sidebar will be hidden when opening components or examples in isolation mode even if this value is set to true. When set to false, sidebar will always be hidden.',
		type: 'boolean',
		default: true
	},
	simpleEditor: {
		message: 'Use Simple Editor',
		description:
			'Avoid loading CodeMirror and reduce bundle size significantly, use prism.js for code highlighting. Warning: editor options will not be mapped over.',
		type: 'boolean',
		default: false
	},
	skipComponentsWithoutExample: {
		message: 'Skip Components Without Example',
		description:
			'Ignore components that don’t have an example file (as determined by getExampleFilename). These components won’t be accessible from other examples unless you manually require them.',
		type: 'boolean',
		default: false
	},
	sortProps: {
		type: 'function'
	},
	styleguideComponents: {
		type: 'object'
	},
	styleguideDir: {
		uitype: 'string',
		message: 'Styleguide Directory',
		description: 'Folder for static HTML style guide generated with `styleguidist build` command.',
		type: 'directory path',
		default: 'styleguide'
	},
	styleguidePublicPath: {
		type: 'string',
		message: 'Base url path for all the assets',
		description: 'configures the prefix of the server and built urls.',
		default: ''
	},
	styles: {
		type: 'object',
		default: {},
		example: {
			Logo: {
				logo: {
					fontStyle: 'italic'
				}
			}
		}
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
				)
			}
			return val
		}
	},
	theme: {
		type: 'object',
		default: {},
		example: {
			link: 'firebrick',
			linkHover: 'salmon'
		}
	},
	title: {
		message: 'Title',
		description: 'Style guide title',
		type: 'string',
		process: val => {
			if (val) {
				return val
			}
			const name = getUserPackageJson().name || ''
			return `${startCase(name)} Style Guide`
		},
		example: 'My Style Guide'
	},
	updateDocs: {
		type: 'function'
	},
	updateExample: {
		type: 'function',
		default: props => {
			if (props.lang === 'example') {
				props.lang = 'js'
				logger.warn(
					'"example" code block language is deprecated. Use "js", "jsx" or "javascript" instead:\n' +
						consts.DOCS_DOCUMENTING
				)
			}
			return props
		}
	},
	updateWebpackConfig: {
		type: 'function',
		removed: `Use "webpackConfig" option instead:\n${consts.DOCS_WEBPACK}`
	},
	usageMode: {
		message: 'Usage Mode',
		description: 'Defines the initial state of the props and methods tab',
		list: MODES,
		type: 'string',
		process: (value, config) => {
			return config.showUsage === undefined ? value : config.showUsage ? 'expand' : 'collapse'
		},
		default: 'collapse'
	},
	verbose: {
		message: 'Verbose',
		description: 'Print debug information. Same as --verbose command line switch.',
		type: 'boolean',
		default: false
	},
	version: {
		message: 'Version #',
		description: 'The version # of the Styleguide',
		type: 'string'
	},
	vuex: {
		type: 'directory path',
		deprecated: 'Use renderRootJsx option instead'
	},
	webpackConfig: {
		type: ['object', 'function'],
		process: val => {
			if (val) {
				return val
			}

			const file = findUserWebpackConfig()
			if (file) {
				logger.info(`Loading webpack config from:\n${file}`)
				// eslint-disable-next-line import/no-dynamic-require
				return require(file)
			}

			logger.warn(
				'No webpack config found. ' +
					'You may need to specify "webpackConfig" option in your style guide config:\n' +
					consts.DOCS_WEBPACK
			)

			return undefined
		},
		example: {
			module: {
				rules: [
					{
						test: /\.vue$/,
						exclude: /node_modules/,
						loader: 'vue-loader',
						options: {}
					},
					{
						test: /\.js$/,
						exclude: /node_modules/,
						loader: 'babel-loader'
					},
					{
						test: /\.css$/,
						loader: 'style-loader!css-loader'
					},

					{
						test: /\.json$/,
						loader: 'json-loader'
					},
					{
						exclude: [/\.html$/, /\.(js|jsx)$/, /\.css$/, /\.vue$/, /\.json$/],
						loader: 'url-loader',
						query: {
							limit: 10000,
							name: 'static/media/[name].[hash:8].[ext]'
						}
					}
				]
			}
		}
	}
}
