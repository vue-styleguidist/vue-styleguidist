import * as bt from '@babel/types'
import { print } from 'recast'
import { NodePath } from 'ast-types/lib/node-path'
import { TS_PRIMITIVE_MAP } from 'vue-inbrowser-compiler-utils/src'
import type { BlockTag, DocBlockTags, PropDescriptor, TypeOfProp } from '../Documentation'
import getDocblock from './getDocblock'
import getDoclets from './getDoclets'
import transformTagsIntoObject from './transformTagsIntoObject'

export default function getTypeFromAnnotation(typeAnnotation: NodePath): TypeOfProp {
	const primitiveType = TS_PRIMITIVE_MAP[typeAnnotation.node.type as keyof typeof TS_PRIMITIVE_MAP]

	if (primitiveType) {
		return {
			name: primitiveType
		}
	} else if (
		bt.isTSTypeReference(typeAnnotation.node) &&
		bt.isIdentifier(typeAnnotation.node.typeName) &&
		(typeAnnotation.node.typeName.name === 'String' ||
			typeAnnotation.node.typeName.name === 'Number' ||
			typeAnnotation.node.typeName.name === 'Boolean')
	) {
		return {
			name: typeAnnotation.node.typeName.name.toLowerCase() as 'string' | 'number' | 'boolean'
		}
	} else if (bt.isTSLiteralType(typeAnnotation.node)) {
		return {
			name: 'literal',
			value: typeAnnotation.node.literal.value
		}
	} else if (bt.isTSArrayType(typeAnnotation.node)) {
		const elementType = typeAnnotation.get('elementType')
		if (elementType.node) {
			const tsType = getTypeFromAnnotation(elementType)
			const elements =
				tsType.name === 'union' || tsType.name === 'intersection' ? tsType.elements : [tsType]
			return {
				name: 'array',
				elements
			}
		}
		return {
			name: 'array'
		}
	} else if (
		bt.isTSTypeReference(typeAnnotation.node) &&
		bt.isIdentifier(typeAnnotation.node.typeName) &&
		typeAnnotation.node.typeName.name === 'Array'
	) {
		const elements = typeAnnotation.get('typeParameters', 'params').map((t: NodePath) => {
			return getTypeFromAnnotation(t)
		})
		return {
			name: 'array',
			elements
		}
	} else if (
		bt.isTSUnionType(typeAnnotation.node) ||
		bt.isTSIntersectionType(typeAnnotation.node)
	) {
		const elements = typeAnnotation.get('types').map((t: NodePath) => {
			return getTypeFromAnnotation(t)
		})

		return {
			name: bt.isTSUnionType(typeAnnotation.node) ? 'union' : 'intersection',
			elements
		}
	} else if (bt.isTSTypeLiteral(typeAnnotation.node)) {
		return {
			name: 'signature',
			properties: typeAnnotation
				.get('members')
				.map((member: NodePath) => {
					if (bt.isTSPropertySignature(member.node) && bt.isIdentifier(member.node.key)) {
						const subProp: PropDescriptor = {
							name: member.node.key.name,
							type: getTypeFromAnnotation(member.get('typeAnnotation', 'typeAnnotation'))
						}
						decorateItem(member, subProp)
						return subProp
					}
				})
				.filter((p: any) => p)
		}
	}

	return {
		name: 'code',
		code: print(typeAnnotation.node).code
	}
}

export function decorateItem(
	item: NodePath,
	propDescriptor: { description?: string; tags?: Record<string, BlockTag[]> }
) {
	const docBlock = getDocblock(item)
	const jsDoc: DocBlockTags = docBlock ? getDoclets(docBlock) : { description: '', tags: [] }
	const jsDocTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : []

	if (jsDoc.description) {
		propDescriptor.description = jsDoc.description
	}

	if (jsDocTags.length) {
		propDescriptor.tags = transformTagsIntoObject(jsDocTags)
	}
}
