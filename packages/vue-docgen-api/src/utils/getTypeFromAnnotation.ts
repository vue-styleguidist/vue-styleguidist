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

function getTypeObjectFromTSType(type: bt.TSType): ParamType {
	const name =
		bt.isTSTypeReference(type) && bt.isIdentifier(type.typeName)
			? type.typeName.name
			: bt.isTSUnionType(type)
				? type.types.map(t => TS_TYPE_NAME_MAP[t.type]).join(' | ')
				: TS_TYPE_NAME_MAP[type.type]
					? TS_TYPE_NAME_MAP[type.type]
					: type.type

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
