import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import { print, visit } from 'recast'
import { BlockTag, DocBlockTags, ParamType } from '../Documentation'
import getDocblock from './getDocblock'
import getDoclets from './getDoclets'
import transformTagsIntoObject from './transformTagsIntoObject'

export default function getTypeFromAnnotation(
	typeNode: bt.TypeAnnotation | bt.TSTypeAnnotation | bt.Noop | null,
	astPath?: bt.File
): ParamType | undefined {
	if (typeNode) {
		if (bt.isTSTypeAnnotation(typeNode)) {
			return getTypeObjectFromTSType(typeNode.typeAnnotation, astPath)
		} else if (bt.isTypeAnnotation(typeNode)) {
			return getTypeObjectFromFlowType(typeNode.typeAnnotation)
		}
	}
	return undefined
}

const TS_TYPE_NAME_MAP: { [name: string]: string } = {
	TSAnyKeyword: 'any',
	TSUnknownKeyword: 'unknown',
	TSNumberKeyword: 'number',
	TSObjectKeyword: 'object',
	TSBooleanKeyword: 'boolean',
	TSStringKeyword: 'string',
	TSSymbolKeyword: 'symbol',
	TSVoidKeyword: 'void',
	TSUndefinedKeyword: 'undefined',
	TSNullKeyword: 'null',
	TSNeverKeyword: 'never',
	TSArrayType: 'Array',
	TSUnionType: 'union',
	TSIntersectionType: 'intersection'
}

function printType(t?: bt.TSType): ParamType {
	if (!t) {
		return { name: '' }
	}

	if (
		bt.isTSLiteralType(t) &&
		!bt.isUnaryExpression(t.literal) &&
		!bt.isTemplateLiteral(t.literal)
	) {
		return { name: JSON.stringify(t.literal.value) }
	}

	if (bt.isTSTypeLiteral(t)) {
		return {
			name: print(t).code
		}
	}

	if (bt.isTSTypeReference(t) && bt.isIdentifier(t.typeName)) {
		const out: ParamType = { name: t.typeName.name }
		if (t.typeParameters?.params) {
			out.elements = t.typeParameters.params.map(type => getTypeObjectFromTSType(type))
		}
		return out
	}

	if (TS_TYPE_NAME_MAP[t.type]) {
		return { name: TS_TYPE_NAME_MAP[t.type] }
	}

	return { name: t.type }
}

function getTypeDefinitionFromIdentifier(astPath: bt.File, typeName: string): NodePath | undefined {
	let typeBody: NodePath | undefined = undefined
	visit(astPath.program, {
		visitTSInterfaceDeclaration(nodePath) {
			if (bt.isIdentifier(nodePath.node.id) && nodePath.node.id.name === typeName) {
				typeBody = nodePath.get('body', 'body')
			}
			return false
		},
		visitTSTypeAliasDeclaration(nodePath) {
			if (bt.isIdentifier(nodePath.node.id) && nodePath.node.id.name === typeName) {
				typeBody = nodePath.get('typeAnnotation', 'members')
			}
			return false
		}
	})
	return typeBody
}

function typeFromLocalType(type: bt.TSType, astPath?: bt.File): ParamType {
	if (astPath && bt.isTSTypeReference(type) && bt.isIdentifier(type.typeName)) {
		const typeDef = getTypeDefinitionFromIdentifier(astPath, type.typeName.name)
		if (typeDef && bt.isTSType(typeDef)) {
			const nakedType = printType(type)
			const resolvedType = getTypeObjectFromTSType(typeDef)
			return { ...nakedType, elements: resolvedType.elements }
		}
	}
	return printType(type)
}

function getTypeObjectFromTSType(type: bt.TSType, astPath?: bt.File): ParamType {
	return bt.isTSUnionType(type) || bt.isTSIntersectionType(type)
		? {
				name: TS_TYPE_NAME_MAP[type.type],
				elements: type.types.map(typeLocal => getTypeObjectFromTSType(typeLocal))
		  }
		: bt.isTSArrayType(type)
		? { name: TS_TYPE_NAME_MAP[type.type], elements: [getTypeObjectFromTSType(type.elementType)] }
		: typeFromLocalType(type, astPath)
}

const FLOW_TYPE_NAME_MAP: { [name: string]: string } = {
	AnyTypeAnnotation: 'any',
	UnknownTypeAnnotation: 'unknown',
	NumberTypeAnnotation: 'number',
	ObjectTypeAnnotation: 'object',
	BooleanTypeAnnotation: 'boolean',
	StringTypeAnnotation: 'string',
	SymbolTypeAnnotation: 'symbol',
	VoidTypeAnnotation: 'void',
	UndefinedTypeAnnotation: 'undefined',
	NullTypeAnnotation: 'null',
	NeverTypeAnnotation: 'never'
}

function getTypeObjectFromFlowType(type: bt.FlowType): ParamType {
	const name = FLOW_TYPE_NAME_MAP[type.type]
		? FLOW_TYPE_NAME_MAP[type.type]
		: bt.isGenericTypeAnnotation(type) && bt.isIdentifier(type.id)
		? type.id.name
		: type.type
	return { name }
}

/**
 * Add tags and description to a prop descriptor from a doc block
 * @param item the ast node for the prop/event/method...
 * @param descriptor the descriptor to decorate
 */
export function decorateItem(
	item: NodePath,
	descriptor: { description?: string; tags?: Record<string, BlockTag[]> }
) {
	const docBlock = getDocblock(item)
	const jsDoc: DocBlockTags = docBlock ? getDoclets(docBlock) : { description: '', tags: [] }
	const jsDocTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : []

	if (jsDoc.description) {
		descriptor.description = jsDoc.description
	}

	if (jsDocTags.length) {
		descriptor.tags = transformTagsIntoObject(jsDocTags)
	}
}
