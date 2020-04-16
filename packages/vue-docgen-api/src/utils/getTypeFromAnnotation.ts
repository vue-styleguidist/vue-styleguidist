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
	TSNeverKeyword: 'never'
}

function printArrayType(t: bt.TSArrayType) {
	return `${printType(t.elementType)}[]`
}

function printArrayTypeFromGeneric(t: bt.TSTypeReference) {
	const type = t.typeParameters ? t.typeParameters.params[0] : undefined
	return `${printType(type)}[]`
}

function printType(t?: bt.TSType): string {
	if (!t) {
		return ''
	}

	if (bt.isTSArrayType(t)) {
		if (t.elementType) {
			return `${printType(t.elementType)}[]`
		}
		return 'array'
	}

	if (bt.isTSLiteralType(t)) {
		return t.literal.value.toString()
	}

	if (bt.isTSTypeReference(t) && bt.isIdentifier(t.typeName)) {
		return t.typeName.name
	}

	if (TS_TYPE_NAME_MAP[t.type]) {
		return TS_TYPE_NAME_MAP[t.type]
	}

	return t.type
}

function printUnionOrIntersectionType(t: bt.TSType): string | number | boolean {
	if (bt.isTSArrayType(t)) {
		return printArrayType(t)
	}

	if (bt.isTSTypeReference(t) && bt.isIdentifier(t.typeName) && t.typeName.name === 'Array') {
		return printArrayTypeFromGeneric(t)
	}

	return printType(t)
}

function getTypeObjectFromTSType(type: bt.TSType): ParamType {
	const name =
		bt.isTSUnionType(type) || bt.isTSIntersectionType(type)
			? type.types.map(printUnionOrIntersectionType).join(bt.isTSUnionType(type) ? ' | ' : ' & ')
			: printType(type)

	return { name }
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
