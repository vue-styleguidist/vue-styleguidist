const configSchema = require('vue-styleguidist/lib/scripts/schemas/config')

const CONFIG = 'io.github.vue-styleguidist'

const TYPE_MAP = {
	string: 'input',
	boolean: 'confirm'
}

function onRead({ data }) {
	const styleguide = data.styleguide || {}
	const filteredSchema = Object.keys(configSchema).reduce(function(acc, key) {
		const configParam = configSchema[key]

		// Since for some parameters, multiple types are allowed,
		// we have to specify which one will be displayed in vue ui
		// hence the `uitype`
		var type = TYPE_MAP[configParam.uitype || configParam.type]

		// Only load parameters that have a `message` member
		// and whose type we support
		if (configParam.message && type) {
			const paramComputed = {
				name: key,
				type,
				message: configParam.message,
				description: configParam.description,
				default: configParam.default,
				link: `https://vue-styleguidist.github.io/Configuration.html#${key}`,
				value: styleguide[key]
			}

			// in the original config choice lists are promped as strings,
			// here we update it if we find the list object
			if (configParam.list) {
				paramComputed.type = 'list'
				paramComputed.choices = configParam.list
			}
			acc[key] = paramComputed
		}
		return acc
	}, {})

	return {
		tabs: [
			{
				id: 'general',
				label: 'General',
				prompts: [
					'title',
					'version',
					'components',
					'ignore',
					'defaultExample',
					'skipComponentsWithoutExample',
					'jsxInComponents',
					'pagePerSection',
					'usageMode',
					'exampleMode',
					'showSidebar',
					'simpleEditor',
					'mountPointId',
					'ribbon',
					'styleguideDir',
					'assetsDir',
					'displayOrigins',
					'minimize'
				]
					.map(key => filteredSchema[key])
					.filter(p => !!p)
			},
			{
				id: 'server',
				label: 'Server Configuration',
				prompts: ['serverPort', 'serverHost', 'verbose', 'styleguidePublicPath']
					.map(key => filteredSchema[key])
					.filter(p => !!p)
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

module.exports = {
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
