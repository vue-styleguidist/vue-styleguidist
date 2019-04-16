const configSchema = require('vue-styleguidist/scripts/schemas/config')

const CONFIG = 'io.github.vue-styleguidist'

const TYPE_MAP = {
	string: 'input',
	boolean: 'confirm'
}

function onRead({ data }) {
	const styleguide = data.styleguide || {}
	const filteredSchema = Object.keys(configSchema).reduce(function(acc, key) {
		const configParam = configSchema[key]
		var type = TYPE_MAP[configParam.uitype || configParam.type]
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
					'pagePerSection',
					'usageMode',
					'exampleMode',
					'showSidebar',
					'simpleEditor',
					'mountPointId',
					'ribbon',
					'styleguideDir',
					'assetsDir'
				].map(key => filteredSchema[key])
			},
			{
				id: 'server',
				label: 'Server Configuration',
				prompts: ['serverPort', 'serverHost', 'verbose'].map(key => filteredSchema[key])
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
