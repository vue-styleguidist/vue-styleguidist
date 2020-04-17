import * as bt from '@babel/types'
import { ParamType } from '../Documentation'

export default function getTypeFromAnnotation(
	typeNode: bt.TypeAnnotation | bt.TSTypeAnnotation | bt.Noop | null
): ParamType | undefined {
	if (typeNode) {
		if (bt.isTSTypeAnnotation(typeNode)) {
			return getTypeObjectFromTSType(typeNode.typeAnnotation)
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

	if (bt.isTSLiteralType(t)) {
		return { name: JSON.stringify(t.literal.value) }
	}

	if (bt.isTSTypeReference(t) && bt.isIdentifier(t.typeName)) {
		const out: ParamType = { name: t.typeName.name }
		if (t.typeParameters && t.typeParameters.params) {
			out.elements = t.typeParameters.params.map(getTypeObjectFromTSType)
		}
		return out
	}

	if (TS_TYPE_NAME_MAP[t.type]) {
		return { name: TS_TYPE_NAME_MAP[t.type] }
	}

	return { name: t.type }
}

function getTypeObjectFromTSType(type: bt.TSType): ParamType {
	return bt.isTSUnionType(type) || bt.isTSIntersectionType(type)
		? { name: TS_TYPE_NAME_MAP[type.type], elements: type.types.map(getTypeObjectFromTSType) }
		: bt.isTSArrayType(type)
			? { name: TS_TYPE_NAME_MAP[type.type], elements: [getTypeObjectFromTSType(type.elementType)] }
			: printType(type)
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
