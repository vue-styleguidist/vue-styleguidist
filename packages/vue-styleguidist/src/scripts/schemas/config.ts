// If you want to access any of these options in React, don’t forget to update CLIENT_CONFIG_OPTIONS array
// in loaders/styleguide-loader.js
import path from 'path'
import { Configuration } from 'webpack'
import startCase from 'lodash/startCase'
import kleur from 'kleur'
import loggerMaker from 'glogg'
import getUserPackageJson from 'react-styleguidist/lib/scripts/utils/getUserPackageJson'
import StyleguidistError from 'react-styleguidist/lib/scripts/utils/error'
import fileExistsCaseInsensitive from 'react-styleguidist/lib/scripts/utils/findFileCaseInsensitive'
import * as Rsg from 'react-styleguidist'
import { StyleguidistConfig } from '../../types/StyleGuide'
import findUserWebpackConfig from '../utils/findUserWebpackConfig'
import consts from '../consts'

const logger = loggerMaker('rsg')

const DEFAULT_COMPONENTS_PATTERN = `src/{components,Components}/**/*.vue`

const MODES = ['collapse', 'expand', 'hide'].map(m => ({ value: m, name: m }))

export default {
	assetsDir: {
		uitype: 'string',
		message: 'Assets Directory',
		description:
			'Your application static assets folder, will be accessible as / in the style guide dev server.',
		type: 'existing directory path',
		example: 'assets'
	},
	codeSplit: {
		default: true,
		message: 'Code Split',
		description:
			'Should the styleguide try code splitting for better performance? NOte that you will need the proper transform in your babel config',
		type: 'boolean'
	},
	compilerConfig: {
		tstype: 'TransformOptions',
		type: 'object',
		default: {
			objectAssign: 'Object.assign'
		}
	},
	// `components` is a shortcut for { sections: [{ components }] },
	// see `sections` below
	components: {
		tstype: '(() => string[]) | string | string[]',
		uitype: 'string',
		message: 'Components',
		description:
			'Where to find the components. Takes in a String or an Array of glob paths. Comma separated.',
		type: ['string', 'function', 'array'],
		example: 'components/**/[A-Z]*.vue'
	},
	configDir: {
		uitype: 'string',
		process: (value: string, config: StyleguidistConfig, rootDir: string) => rootDir
	},
	context: {
		tstype: 'Record<string, any>',
		type: 'object',
		default: {},
		example: {
			map: 'lodash/map'
		}
	},
	contextDependencies: {
		tstype: 'string[]',
		type: 'array'
	},
	configureServer: {
		tstype: '(server: WebpackDevServer, env: string) => string',
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
		tstype: '(server: Configuration, env: string) => Configuration',
		description: 'Allows you to modify webpack config without any restrictions',
		type: 'function'
	},
	defaultExample: {
		tstype: 'string',
		uitype: 'boolean',
		message: 'Default Example',
		description:
			"Display each component with a default example, regardless of if there's a README or <docs/> block written.",
		type: ['boolean', 'existing file path'],
		default: false,
		process: (val: string | boolean) =>
			val === true ? path.resolve(__dirname, '../../../templates/DefaultExample.md') : val
	},
	displayOrigins: {
		type: 'boolean',
		message: 'Show the origins of each prop',
		description:
			'In the generated docs, this adda a column to the props table giving in which file it is defined. Useful when extending comopnents or mixing mixins',
		default: false
	},
	editorConfig: {
		tstype: ['{', '		theme: string', '	}'].join('\n'),
		type: 'object',
		process: (value: any, config: StyleguidistConfig) => {
			if ((config.simpleEditor === undefined || config.simpleEditor) && value) {
				throw new StyleguidistError(
					`
${kleur.bold('editorConfig')} config option is useless without activating the CodeMirror editor. 
Read the documentation to see how to re-activate it.
https://vue-styleguidist.github.io/Configuration.html#editorconfig `,
					'editorConfig'
				)
			}

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
		tstype: 'Rsg.EXPAND_MODE',
		message: 'Example Mode',
		description: 'Defines the initial state of the props and methods tab',
		list: MODES,
		type: 'string',
		process: (value: string, config: StyleguidistConfig) => {
			return config.showCode === undefined ? value : config.showCode ? 'expand' : 'collapse'
		},
		default: 'collapse'
	},
	getComponentPathLine: {
		tstype: '(componentPath: string) => string',
		type: 'function',
		default: (componentPath: string) => componentPath
	},
	getExampleFilename: {
		tstype: '(componentPath: string) => string',
		type: 'function',
		default: (componentPath: string) => {
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
		example: (componentPath: string) => componentPath.replace(/\.(jsx|vue)?$/, '.examples.md')
	},
	highlightTheme: {
		type: 'string',
		default: 'base16-light',
		deprecated: 'Use the theme property in the editorConfig option instead'
	},
	ignore: {
		tstype: 'string[]',
		message: 'Ignore',
		description: 'What components to ignore. Can be an Array or String. Comma separated.',
		type: 'array',
		default: ['**/__tests__/**', `**/*.test.vue`, `**/*.spec.vue`, '**/*.d.ts']
	},
	jssThemedEditor: {
		message: 'Should PrismJs editors be themed using JSS',
		description:
			'By default, the PrismJs editor is themed in the theme files. If you want to use a theme defined in CSS, set this to false and require the CSS file in the `require` config.',
		type: 'boolean',
		default: true
	},
	jsxInComponents: {
		message: 'JSX in Components',
		description:
			'Do documented components contain JSX syntax? Set this to `false` to restore compatibility with this TypeScript cast syntax: `<any>variable` instead of `variable as any`.',
		type: 'boolean',
		default: true
	},
	jsxInExamples: {
		message: 'JSX in Markdown Examples',
		description:
			'Allow exmaples to contain JSX syntax. Use proper JSX Vue component format in examples.',
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
		tstype: 'string[]',
		type: 'array',
		default: [],
		example: ['path/to/mixin.js', 'path/to/created.js'],
		deprecated: 'Use renderRootJsx option instead'
	},
	logger: {
		tstype: [
			'{',
			'		info(message: string): void',
			'		warn(message: string): void',
			'		debug(message: string): void',
			'	}'
		].join('\n'),
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
	progressBar: {
		message: 'Display a progress bar while building',
		type: 'boolean',
		default: true,
		process: (value: boolean | undefined, config: StyleguidistConfig): boolean =>
			value === undefined && !config.verbose ? true : !!value
	},
	propsParser: {
		tstype: '(file: string) => Promise<ComponentDoc>',
		type: 'function'
	},
	require: {
		tstype: 'string[]',
		type: 'array',
		default: [],
		example: ['babel-polyfill', 'path/to/styles.css']
	},
	renderRootJsx: {
		tstype: 'string',
		type: 'directory path'
	},
	ribbon: {
		tstype: ['{', '		url: string,', '		text: string', '	}'].join('\n'),
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
		// sections will be different in the loader and browser config
		// we therfore avoid assigning them a type here so that we can
		// assign it variably
		inherit: true,
		type: 'array',
		default: [],
		process: (
			value: Rsg.ConfigSection[] | undefined,
			config: StyleguidistConfig
		): Rsg.ConfigSection[] => {
			if (!value) {
				// If root `components` isn't empty, make it a first section
				// If `components` and `sections` weren’t specified, use default pattern
				const components = config.components || DEFAULT_COMPONENTS_PATTERN
				return [
					{
						components
					}
				]
			}
			return value
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
		tstype: 'number',
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
		default: true
	},
	skipComponentsWithoutExample: {
		message: 'Skip Components Without Example',
		description:
			'Ignore components that don’t have an example file (as determined by getExampleFilename). These components won’t be accessible from other examples unless you manually require them.',
		type: 'boolean',
		default: false
	},
	sortProps: {
		tstype: '(props: PropDescriptor[]) => PropDescriptor[]',
		type: 'function'
	},
	styleguideComponents: {
		tstype: '{ [name: string]: string }',
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
		type: ['object', 'existing file path', 'function'],
		tstype: 'Styles | string | ((theme: any) => Styles)',
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
		process: (value: any) => {
			if (typeof value === 'string') {
				throw new StyleguidistError(
					`${kleur.bold(
						'template'
					)} config option format has been changed, you need to update your config.`,
					'template'
				)
			}
			return value
		}
	},
	theme: {
		type: ['object', 'existing file path'],
		tstype: '{ [name: string]: any } | string',
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
		process: (value?: string) => {
			if (value) {
				return value
			}
			const name = getUserPackageJson().name || ''
			return `${startCase(name)} Style Guide`
		},
		example: 'My Style Guide'
	},
	updateDocs: {
		tstype: '(doc: LoaderComponentProps, file: string) => LoaderComponentProps',
		type: 'function'
	},
	updateExample: {
		tstype: [
			'(',
			"		props: Pick<Rsg.CodeExample, 'content' | 'lang' | 'settings'>,",
			'		ressourcePath: string',
			'	) => Rsg.CodeExample'
		].join('\n'),
		type: 'function',
		default: (props: Pick<Rsg.CodeExample, 'content' | 'lang' | 'settings'>) => {
			if (props.lang === 'example') {
				props.lang = 'js'
				logger.warn(
					'"example" code block language is deprecated. Use "vue", "js", "jsx" or "javascript" instead:\n' +
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
		tstype: 'Rsg.EXPAND_MODE',
		message: 'Usage Mode',
		description: 'Defines the initial state of the props and methods tab',
		list: MODES,
		type: 'string',
		process: (value: string, config: StyleguidistConfig) => {
			return config.showUsage === undefined ? value : config.showUsage ? 'expand' : 'collapse'
		},
		default: 'collapse'
	},
	tocMode: {
		tstype: 'Rsg.EXPAND_MODE',
		message: 'Table Of Contents Collapsed mode',
		description:
			'If set to collapse, the sidebar sections are collapsed by default. Handy when dealing with big Components bases',
		list: MODES,
		type: 'string',
		default: 'expand'
	},
	validExtends: {
		message: 'Should the passed filepath be parsed by docgen if mentionned extends',
		type: 'function',
		tstype: '(filePath: string) => boolean',
		default: (fullFilePath: string) => !/[\\/]node_modules[\\/]/.test(fullFilePath)
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
		tstype: 'Configuration',
		type: ['object', 'function'],
		process: (val?: Configuration) => {
			if (val) {
				return val
			}

			const file = findUserWebpackConfig()
			if (typeof file === 'string') {
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
