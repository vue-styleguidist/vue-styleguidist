import { ParamType } from 'vue-docgen-api'

export default function renderTypeString(type: ParamType): string {
	if (!type) {
		return 'unknown'
	}

	const { name, elements } = type

	switch (name) {
		case 'Array':
			return elements ? `${renderTypeString(elements[0])}[]` : name
		case 'union':
			return (elements || []).map(renderTypeString).join(' | ')
		case 'intersection':
			return (elements || []).map(renderTypeString).join(' & ')
		default:
			return `${name}${elements ? `<${elements.map(renderTypeString).join(', ')}>` : ''}`
	}
}
