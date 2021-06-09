import { SlotDescriptor } from 'vue-docgen-api'
import { mdclean } from './utils'
import { SubTemplateOptions } from '../compileTemplates'

const formatBindings: (slot: SlotDescriptor['bindings']) => string = bindings => {
	if (!bindings) {
		return ''
	}
	return bindings
		.map(binding => {
			const { name, description, type } = binding
			if (!type) {
				return ''
			}
			return `**${name}** \`${
				type.name === 'union' && type.elements
					? type.elements.map(({ name: insideName }) => insideName).join(', ')
					: type.name
			}\` - ${description}`
		})
		.join('\n')
}

export default (slots: SlotDescriptor[], opt: SubTemplateOptions = {}): string => {
	return `
${opt.isSubComponent || opt.hasSubComponents ? '#' : ''}## Slots

  | Name          | Description  | Bindings |
  | ------------- | ------------ | -------- |
  ${slots
		.map(slot => {
			const { description, bindings, name } = slot
			const readableBindings = bindings ? `${formatBindings(bindings)}` : ''

			return `| ${mdclean(name)} | ${mdclean(description || '')} | ${mdclean(readableBindings)} |` // replace returns by <br> to allow them in a table cell
		})
		.join('\n')}
`
}
