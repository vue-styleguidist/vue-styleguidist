import { EventDescriptor } from 'vue-docgen-api'
import { mdclean } from './utils'
import { SubTemplateOptions } from '../compileTemplates'

function formatProperties(properties: EventDescriptor['properties']): string {
	if (!properties) {
		return ''
	}
	return properties
		.map(property => {
			const { name, description, type } = property
			if (!type) {
				return ''
			}
			return `**${name}** \`${type.names.length ? type.names.join(', ') : ''}\` - ${description}`
		})
		.join('\n')
}

const tmpl = (events: EventDescriptor[]) => {
	let ret = ''
	events.forEach(evt => {
		const { description = '', ...e } = evt
		const readableProperties = e.properties ? `${formatProperties(e.properties)}` : ''
		ret += `| ${mdclean(e.name)} | ${mdclean(readableProperties)} | ${mdclean(description)}\n`
	})
	return ret
}

export default (events: EventDescriptor[], opt: SubTemplateOptions = {}): string => {
	return `
${opt.isSubComponent || opt.hasSubComponents ? '#' : ''}## Events

  | Event name     | Properties     | Description  |
  | -------------- |--------------- | -------------|
  ${tmpl(events)}
  `
}
