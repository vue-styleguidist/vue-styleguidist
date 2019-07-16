const camelCase = require('camelcase')

export type CreateElementFunction = (
	component: string | object,
	attributes?: { [k: string]: any },
	children?: any | any[]
) => any[] | any

/**
 * Groups atributes passed to a React pragma to the VueJS fashion
 * @param h the VueJS createElement function passed in render functions
 * @returns pragma usable in buble rendered JSX for VueJS
 */
export default function adaptCreateElement(h: CreateElementFunction): CreateElementFunction {
	return (comp, attr, ...children) => {
		if (attr === undefined) {
			return h(comp)
		} else if (!children.length) {
			return h(comp, groupAttr(attr))
		}
		return h(comp, groupAttr(attr), children)
	}
}

const rootAttributes = [
	'staticClass',
	'class',
	'style',
	'key',
	'ref',
	'refInFor',
	'slot',
	'scopedSlots',
	'model'
]

const prefixedRE = /(on|nativeOn|props|domProps|hook)([A-Z][a-zA-Z]+)/

const getDomPropsRawName = (name: string): string => {
	return name.replace(/^dom(Props|-props)/, '')
}

const groupAttr = (attrs: { [key: string]: any }): { [key: string]: any } | undefined => {
	if (!attrs) {
		return undefined
	}
	const attributes: { [key: string]: any } = {}
	Object.keys(attrs).forEach(name => {
		const value = attrs[name]
		const ccName = camelCase(name)
		if (rootAttributes.includes(ccName)) {
			attributes[ccName] = value
		} else if (prefixedRE.test(ccName)) {
			const foundName = prefixedRE.exec(ccName)
			if (foundName) {
				const prefix = foundName[1]
				const rawName = prefix === 'domProps' ? getDomPropsRawName(name) : foundName[2]
				const camelCasedName = rawName[0].toLowerCase() + rawName.slice(1)
				if (!attributes[prefix]) {
					attributes[prefix] = {}
				}
				attributes[prefix][camelCasedName] = value
			}
		} else {
			attributes.attrs = attributes.attrs || {}
			attributes.attrs[/^data-/.test(name) ? name : ccName] = value
		}
	})
	return attributes
}
