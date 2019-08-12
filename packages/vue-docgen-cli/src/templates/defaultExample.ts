import { ComponentDoc, PropDescriptor } from 'vue-docgen-api'
import { cleanName } from './utils'

function getDefaultText(): string {
	return 'lorem ipsum'
}

function getDefaultNumber(): string {
	return '42'
}

function getDefaultBoolean(): string {
	return 'true'
}

function getDefaultArray(): string {
	return '[1, 2, 3]'
}

function getDefaultFunction(): string {
	return '() => void'
}

function getDefaultDate(): string {
	return 'new Date(\'2012-12-12\')'
}

function getDefaultObject(): string {
	return '{}'
}

function getDefault(prop: PropDescriptor): string {
	if (!prop || !prop.type) {
		return getDefaultText()
	} else if (prop.type.name === 'string') {
		return getDefaultText()
	} else if (prop.type.name === 'number') {
		return getDefaultNumber()
	} else if (prop.type.name === 'boolean') {
		return getDefaultBoolean()
	} else if (prop.type.name === 'object') {
		return getDefaultObject()
	} else if (prop.type.name === 'array') {
		return getDefaultArray()
	} else if (prop.type.name === 'func') {
		return getDefaultFunction()
	} else if (prop.type.name === 'date') {
		return getDefaultDate()
	}
	return getDefaultText()
}

export default (doc: ComponentDoc): string => {
	const { displayName, props, slots } = doc
	const cleanedName = cleanName(displayName)
	const propsAttr: string[] = props
		? Object.keys(props)
				.filter(p => props[p].required)
				.map(p => ` ${p}="${getDefault(props[p])}"`)
		: []
	return `
\`\`\`vue live
  <${cleanedName}${propsAttr.join(' ')}${
		!slots.default ? '/>' : `>${getDefaultText()}</${cleanedName}>`
	}
\`\`\`
`
}
