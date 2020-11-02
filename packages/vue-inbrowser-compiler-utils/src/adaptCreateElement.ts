import camelCase from 'camelcase'

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
	return (comp, attr, ...children: any[]) => {
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

const prefixedRE = /^(on|nativeOn|props|domProps|hook|v)([A-Z][a-zA-Z]+)?$/

const getRawName = (name: string): string => {
	return name.replace(/^(on|native(On|-on)|props|dom(Props|-props)|hook|v)-?/, '')
}

/**
 * Make sure an object is an array
 * and if it is not wrap it inside one
 * @param a
 */
const makeArray = (a: any): any[] => {
	return Array.isArray(a) ? a : [a]
}

/**
 * create a functoin out of two other
 * @param fn1
 * @param fn2
 */
const mergeFn = (
	fn1: (...argz1: any[]) => void,
	fn2: (...argz2: any[]) => void
): ((...argz: any[]) => void) =>
	function (this: any, ...argzMain: any[]) {
		fn1 && fn1.apply(this, argzMain)
		fn2 && fn2.apply(this, argzMain)
	}

/**
 * merge two members of the spread
 * @param a
 * @param b
 */
const merge = (a: any, b: any): any => {
	// initialization case
	if (a === undefined) {
		return b
	}
	// merge of functions
	if (typeof a === 'function' && typeof b === 'function') {
		return mergeFn(a, b)
	}
	// merge of other options (like class)
	return makeArray(a).concat(b)
}

export const concatenate = (
	src: { [key: string]: any },
	...otherObj: { [key: string]: any }[]
): { [key: string]: any } => {
	src = src || {}
	otherObj.forEach(obj => {
		Object.keys(obj).forEach((key: string) => {
			src[key] = merge(src[key], obj[key])
		})
	})
	return src
}

const groupAttr = (attrsIn: { [key: string]: any }): { [key: string]: any } | undefined => {
	if (!attrsIn) {
		return undefined
	}
	const attrsOut: { [key: string]: any } = {}
	Object.keys(attrsIn).forEach(name => {
		const value = attrsIn[name]
		const ccName = camelCase(name)
		if (rootAttributes.indexOf(ccName) > 0) {
			attrsOut[ccName] = value
		} else if (name === 'attrs') {
			attrsOut.attrs = concatenate(attrsOut.attrs, value)
		} else if (prefixedRE.test(ccName)) {
			const foundName = prefixedRE.exec(ccName)
			if (foundName) {
				const prefix = foundName[1]
				const rawName = getRawName(name)
				const camelCasedName = rawName.length ? rawName[0].toLowerCase() + rawName.slice(1) : ''
				if (prefix === 'v') {
					if (!attrsOut.directives) {
						attrsOut.directives = []
					}
					attrsOut.directives.push({
						name: camelCasedName,
						value
					})
				} else {
					if (!attrsOut[prefix]) {
						attrsOut[prefix] = {}
					}
					if (camelCasedName.length) {
						// if it is a litteral prefixed attribute
						attrsOut[prefix][camelCasedName] = merge(attrsOut[prefix][camelCasedName], value)
					} else {
						// if it is a spread
						concatenate(attrsOut[prefix], value)
					}
				}
			}
		} else {
			attrsOut.attrs = attrsOut.attrs || {}
			const finalName = /^data-/.test(name) ? name : ccName === 'xlinkHref' ? 'xlink:href' : ccName
			attrsOut.attrs[finalName] = value
		}
	})
	return attrsOut
}
