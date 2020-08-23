const parseConfigInterface = require('./parseConfigInterface')

const configSchema = parseConfigInterface('vue-docgen-cli/lib/config.d.ts', 'DocgenCLIConfig')

const CONFIG = 'io.github.vue-styleguidist.docgen'

const TYPE_MAP = {
	string: 'input',
	boolean: 'confirm'
}

function onRead({ data }) {
	const docgen = data.docgen || {}

	return {
		prompts: configSchema
			.map(configParam => {
				var type = TYPE_MAP[configParam.type]

				// Only load parameters that have a `message` member
				// and whose type we support
				if (configParam.message && type) {
					return {
						...configParam,
						link: `https://vue-styleguidist.github.io/docs/docgen-cli.html#${configParam.name}`,
						type,
						value: docgen[configParam.name]
					}
				}
				return undefined
			})
			.filter(p => p)
	}
}

function onWrite({ api, prompts }) {
	const docgenData = {}
	prompts.forEach(ppt => {
		const result = ppt.valueChanged
		if (result) {
			docgenData[ppt.id] = ppt.value
		}
	})
	api.setData('docgen', docgenData)
}

module.exports = {
	id: CONFIG,
	name: 'Docgen CLI',
	description: 'Create your style guide',
	link: 'https://vue-styleguidist.github.io/docgen-cli',
	files: {
		docgen: {
			js: ['docgen.config.js']
		}
	},
	onRead,
	onWrite
}
