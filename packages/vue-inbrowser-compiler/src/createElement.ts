const camelCase = require('camelcase')

export default function createElement(
	h: (comp: object | string, attr: { [key: string]: any }, children: any[]) => any[] | any
) {
	return (comp: object | string, attr: { [key: string]: any }, ...children: any[]): any[] | any => {
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

const onRE = /(on|nativeOn|domProps)([A-Z][a-zA-Z]+)/

const groupAttr = (attrs: { [key: string]: any }): { [key: string]: any } => {
	if (!attrs) return attrs
	const attributes: { [key: string]: any } = {}
	Object.keys(attrs).forEach(name => {
		const value = attrs[name]
		const ccName = camelCase(name)
		if (rootAttributes.includes(ccName)) {
			attributes[ccName] = value
		} else if (onRE.test(ccName)) {
			const foundName = onRE.exec(ccName)
			if (foundName) {
				const rawEventName = foundName[2]
				const eventName = camelCase(rawEventName)
				const prefix = foundName[1]
				if (!attributes[prefix]) {
					attributes[prefix] = {}
				}
				attributes[prefix][eventName] = value
			}
		}
	})
	return attributes
}
