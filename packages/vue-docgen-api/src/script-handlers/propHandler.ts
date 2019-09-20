import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import recast from 'recast'
import Documentation, { BlockTag, DocBlockTags, PropDescriptor } from '../Documentation'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'
import transformTagsIntoObject from '../utils/transformTagsIntoObject'
import getMemberFilter from '../utils/getPropsFilter'

type ValueLitteral = bt.StringLiteral | bt.BooleanLiteral | bt.NumericLiteral

export default function propHandler(documentation: Documentation, path: NodePath) {
	if (bt.isObjectExpression(path.node)) {
		const propsPath = path
			.get('properties')
			.filter((p: NodePath) => bt.isObjectProperty(p.node) && getMemberFilter('props')(p))

		// if no prop return
		if (!propsPath.length) {
			return
		}

		const propsValuePath = propsPath[0].get('value')

		if (bt.isObjectExpression(propsValuePath.node)) {
			const objProp = propsValuePath.get('properties')

			// filter non object properties
			const objPropFiltered = objProp.filter((p: NodePath) => bt.isProperty(p.node)) as Array<
				NodePath<bt.Property>
			>
			objPropFiltered.forEach(prop => {
				const propNode = prop.node

				// description
				const docBlock = getDocblock(prop)
				const jsDoc: DocBlockTags = docBlock ? getDoclets(docBlock) : { description: '', tags: [] }
				const jsDocTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : []

				// if it's the v-model describe it only as such
				const propName = jsDocTags.some(t => t.title === 'model')
					? 'v-model'
					: propNode.key.name || propNode.key.value

				const propDescriptor = documentation.getPropDescriptor(propName)

				// save real prop name for reference when v-model
				propDescriptor.name = propNode.key.name || propNode.key.value

				const propValuePath = prop.get('value')

				propDescriptor.tags = jsDocTags.length ? transformTagsIntoObject(jsDocTags) : {}
				if (jsDoc.description) {
					propDescriptor.description = jsDoc.description
				}

				if (bt.isArrayExpression(propValuePath.node) || bt.isIdentifier(propValuePath.node)) {
					// if it's an immediately typed property, resolve its type immediately
					propDescriptor.type = getTypeFromTypePath(propValuePath)
				} else if (bt.isObjectExpression(propValuePath.node)) {
					// standard default + type + required
					const propPropertiesPath = propValuePath
						.get('properties')
						.filter((p: NodePath) => bt.isObjectProperty(p.node)) as Array<
						NodePath<bt.ObjectProperty>
					>

					// type
					describeType(propPropertiesPath, propDescriptor)

					// required
					describeRequired(propPropertiesPath, propDescriptor)

					// default
					describeDefault(propPropertiesPath, propDescriptor)
				} else if (bt.isTSAsExpression(propValuePath.node)) {
					// standard default + type + required with TS as annotation
					const propPropertiesPath = propValuePath
						.get('expression')
						.get('properties')
						.filter((p: NodePath) => bt.isObjectProperty(p.node)) as Array<
						NodePath<bt.ObjectProperty>
					>

					// type
					propDescriptor.type = getTypeFromTypePath(propValuePath)

					// required
					describeRequired(propPropertiesPath, propDescriptor)

					// default
					describeDefault(propPropertiesPath, propDescriptor)
				} else {
					// in any other case, just display the code for the typing
					propDescriptor.type = {
						name: recast.print(prop.get('value')).code,
						func: true
					}
				}
			})
		} else if (bt.isArrayExpression(propsValuePath.node)) {
			propsValuePath
				.get('elements')
				.filter((e: NodePath) => bt.isStringLiteral(e.node))
				.forEach((e: NodePath<bt.StringLiteral>) => {
					const propDescriptor = documentation.getPropDescriptor(e.node.value)
					propDescriptor.type = { name: 'undefined' }
					propDescriptor.required = ''
				})
		}
	}
}

export function describeType(
	propPropertiesPath: Array<NodePath<bt.ObjectProperty>>,
	propDescriptor: PropDescriptor
) {
	const typeArray = propPropertiesPath.filter(getMemberFilter('type'))
	if (typeArray.length) {
		propDescriptor.type = getTypeFromTypePath(typeArray[0].get('value'))
	} else {
		// deduce the type from default expression
		const defaultArray = propPropertiesPath.filter(getMemberFilter('default'))
		if (defaultArray.length) {
			const typeNode = defaultArray[0].node
			const func =
				bt.isArrowFunctionExpression(typeNode.value) || bt.isFunctionExpression(typeNode.value)
			const typeValueNode = defaultArray[0].get('value').node as ValueLitteral
			const typeName = typeof typeValueNode.value
			propDescriptor.type = { name: func ? 'func' : typeName }
		}
	}
}

const VALID_VUE_TYPES = [
	'string',
	'number',
	'boolean',
	'array',
	'object',
	'date',
	'function',
	'symbol'
]

function getTypeFromTypePath(typePath: NodePath): { name: string; func?: boolean } {
	const typeNode = typePath.node

	const typeName =
		bt.isTSAsExpression(typeNode) &&
		bt.isTSTypeReference(typeNode.typeAnnotation) &&
		typeNode.typeAnnotation.typeParameters
			? recast.print(typeNode.typeAnnotation.typeParameters.params[0]).code
			: bt.isArrayExpression(typeNode)
				? typePath
						.get('elements')
						.map((t: NodePath) => getTypeFromTypePath(t).name)
						.join('|')
				: typeNode &&
				  bt.isIdentifier(typeNode) &&
				  VALID_VUE_TYPES.indexOf(typeNode.name.toLowerCase()) > -1
					? typeNode.name.toLowerCase()
					: recast.print(typeNode).code
	return {
		name: typeName === 'function' ? 'func' : typeName
	}
}

export function describeRequired(
	propPropertiesPath: Array<NodePath<bt.ObjectProperty>>,
	propDescriptor: PropDescriptor
) {
	const requiredArray = propPropertiesPath.filter(getMemberFilter('required'))
	const requiredNode = requiredArray.length ? requiredArray[0].get('value').node : undefined
	propDescriptor.required =
		requiredNode && bt.isBooleanLiteral(requiredNode) ? requiredNode.value : ''
}

export function describeDefault(
	propPropertiesPath: Array<NodePath<bt.ObjectProperty>>,
	propDescriptor: PropDescriptor
) {
	const defaultArray = propPropertiesPath.filter(getMemberFilter('default'))
	if (defaultArray.length) {
		let defaultPath = defaultArray[0].get('value')

		let parenthesized = false
		if (
			bt.isArrowFunctionExpression(defaultPath.node) &&
			bt.isObjectExpression(defaultPath.node.body) // if () => ({})
		) {
			defaultPath = defaultPath.get('body')
			const extra = (defaultPath.node as any).extra
			if (extra && extra.parenthesized) {
				parenthesized = true
			}
		}

		const rawValue = recast.print(defaultPath).code
		propDescriptor.defaultValue = {
			func: bt.isFunction(defaultPath.node),
			value: parenthesized ? rawValue.slice(1, rawValue.length - 1) : rawValue
		}
	}
}
