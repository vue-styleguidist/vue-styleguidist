import { ParamType } from 'vue-docgen-api'

export default function renderTypeString(type: ParamType): string {
	if (!type) {
		return 'unknown'
	}

	const { name } = type

	switch (name) {
		case 'Array':
			return type.elements ? `${renderTypeString(type.elements[0])}[]` : name
		case 'union':
			return (type.elements || []).map(renderTypeString).join(' | ')
		case 'intersection':
			return (type.elements || []).map(renderTypeString).join(' & ')
		default:
			return name
	}
}
