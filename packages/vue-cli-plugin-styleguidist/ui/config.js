const CONFIG = 'io.github.vue-styleguidist'

const MODES = ['collapse', 'expand', 'hide'].map(m => ({ value: m, name: m }))

function onRead({ data }) {
	const styleguide = data.styleguide || {}

	return {
		tabs: [
			{
				id: 'general',
				label: 'General',
				prompts: [
					{
						name: 'title',
						type: 'input',
						message: 'Title',
						description: 'Style guide title',
						default: 'Default Style Guide',
						link: 'https://vue-styleguidist.github.io/Configuration.html#title',
						value: styleguide.title
					},
					{
						name: 'version',
						type: 'input',
						message: 'Version #',
						description: 'The version # of the Styleguide',
						default: '1.0.0',
						link: 'https://vue-styleguidist.github.io/Configuration.html#version',
						value: styleguide.version
					},
					{
						name: 'components',
						type: 'input',
						message: 'Components',
						description:
							'Where to find the components. Takes in a String or an Array of glob paths. Comma separated.',
						default: 'src/components/**/*.vue',
						link: 'https://vue-styleguidist.github.io/Configuration.html#components',
						value: styleguide.components
					},
					{
						name: 'ignore',
						type: 'input',
						message: 'Ignore',
						description: 'What components to ignore. Can be an Array or String. Comma separated.',
						default: ['**/__tests__/**'],
						link: 'https://vue-styleguidist.github.io/Configuration.html#ignore',
						value: styleguide.ignore
					},
					{
						name: 'defaultExample',
						type: 'confirm',
						message: 'Default Example',
						description:
							"Display each component with a default example, regardless of if there's a README or <docs/> block written.",
						default: true,
						link: 'https://vue-styleguidist.github.io/Configuration.html#defaultexample',
						value: styleguide.defaultExample
					},
					{
						name: 'skipComponentsWithoutExample',
						type: 'confirm',
						message: 'Skip Components Without Example',
						description:
							'Ignore components that don’t have an example file (as determined by getExampleFilename). These components won’t be accessible from other examples unless you manually require them.',
						default: false,
						link:
							'https://vue-styleguidist.github.io/Configuration.html#skipcomponentswithoutexample',
						value: styleguide.skipComponentsWithoutExample
					},
					{
						name: 'pagePerSection',
						type: 'confirm',
						message: 'Page Per Section',
						description:
							'Render one section or component per page. If true, each section will be a single page.',
						link: 'https://vue-styleguidist.github.io/Configuration.html#pagepersection',
						default: false,
						value: styleguide.pagePerSection
					},
					{
						name: 'usageMode',
						type: 'list',
						message: 'Usage Mode',
						description: 'Defines the initial state of the props and methods tab',
						default: 'collapse',
						choices: MODES,
						link: 'https://vue-styleguidist.github.io/Configuration.html#usagemode',
						value: styleguide.usageMode
					},
					{
						name: 'exampleMode',
						type: 'list',
						message: 'Example Mode',
						description: 'Defines the initial state of the props and methods tab',
						default: 'collapse',
						choices: MODES,
						link: 'https://vue-styleguidist.github.io/Configuration.html#examplemode',
						value: styleguide.exampleMode
					},
					{
						name: 'showSidebar',
						type: 'confirm',
						message: 'Show Sidebar',
						description:
							'Toggle sidebar visibility. Sidebar will be hidden when opening components or examples in isolation mode even if this value is set to true. When set to false, sidebar will always be hidden.',
						link: 'https://vue-styleguidist.github.io/Configuration.html#showsidebar',
						default: true,
						value: styleguide.showSidebar
					},
					{
						name: 'simpleEditor',
						type: 'confirm',
						message: 'Use Simple Editor',
						description:
							'Avoid loading CodeMirror and reduce bundle size significantly, use prism.js for code highlighting. Warning: editor options will not be mapped over.',
						link: 'https://vue-styleguidist.github.io/Configuration.html#simpleeditor',
						default: false,
						value: styleguide.simpleEditor
					},
					{
						name: 'mountPointId',
						type: 'input',
						message: 'Mount Point ID',
						description: 'The ID of a DOM element where Styleguidist mounts.',
						link: 'https://vue-styleguidist.github.io/Configuration.html#mountpointid',
						default: 'rsg-root',
						value: styleguide.mountPointId
					},
					{
						name: 'ribbon',
						type: 'confirm',
						message: 'Ribbon',
						description:
							"Shows 'Fork Me' ribbon in the top-right corner. If ribbon key is present, then it's required to add url property; text property is optional. If you want to change styling of the ribbon, please, refer to the theme section in the documentation.",
						link: 'https://vue-styleguidist.github.io/Configuration.html#ribbon',
						default: false,
						value: styleguide.ribbon
					},
					{
						name: 'styleguideDir',
						type: 'input',
						message: 'Styleguide Directory',
						default: 'styleguide',
						description:
							'Folder for static HTML style guide generated with `styleguidist build` command.',
						link: 'https://vue-styleguidist.github.io/Configuration.html#styleguidedir',
						value: styleguide.styleguideDir
					},
					{
						name: 'assetsDir',
						type: 'input',
						message: 'Assets Directory',
						default: '',
						description:
							'Your application static assets folder, will be accessible as / in the style guide dev server.',
						link: 'https://vue-styleguidist.github.io/Configuration.html#assetsdir',
						value: styleguide.assetsDir
					}
				]
			},
			{
				id: 'server',
				label: 'Server Configuration',
				prompts: [
					{
						name: 'serverPort',
						message: 'Server Port',
						description: 'Dev server port',
						type: 'input',
						default: '6060',
						value: styleguide.serverPort
					},
					{
						name: 'serverHost',
						message: 'Server Host',
						description: 'Dev server host name',
						type: 'input',
						default: '0.0.0.0',
						value: styleguide.serverHost
					},
					{
						name: 'verbose',
						type: 'confirm',
						message: 'Verbose',
						description: 'Print debug information. Same as --verbose command line switch.',
						default: false,
						link: 'https://vue-styleguidist.github.io/Configuration.html#verbose',
						value: styleguide.verbose
					}
				]
			}
		]
	}
}

function onWrite({ api, prompts }) {
	const styleguideData = {}
	for (const prompt of prompts) {
		const result = prompt.valueChanged
		if (result) {
			styleguideData[prompt.id] = prompt.value
		}
	}
	api.setData('styleguide', styleguideData)
}

const config = {
	id: CONFIG,
	name: 'Vue Styleguidist configuration',
	description: 'Create your style guide',
	link: 'https://vue-styleguidist.github.io',
	files: {
		styleguide: {
			js: ['styleguide.config.js']
		}
	},
	onRead,
	onWrite
}

module.exports = {
	config
}
