export type BlockTag = ParamTag | Tag

export interface Module {
	name: string
	path: string
}

/**
 * Universal model to display origin
 */
export interface Descriptor {
	extends?: Module
	mixin?: Module
}

export interface UnnamedParam {
	type?: TypeOfProp
	description?: string | boolean
}

export interface Param extends UnnamedParam {
	name?: string
}

interface RootTag {
	title: string
}

export interface Tag extends RootTag {
	content: string | boolean
}

export interface ParamTag extends RootTag, Param {}

export interface DocBlockTags {
	description?: string
	tags?: (ParamTag | Tag)[]
}

interface EventType {
	names: string[]
}

interface EventProperty {
	type: EventType
	name?: string
	description?: string | boolean
}

export interface EventDescriptor extends DocBlockTags, Descriptor {
	name: string
	type?: EventType
	properties?: EventProperty[]
}

export const PrimitiveTypes = [
	'boolean',
	'number',
	'string',
	'object',
	'date',
	'symbol',
	'null',
	'undefined',
	'any',
	'unknown',
	'never',
	'void'
] as const

export const TS_PRIMITIVE_MAP: { [name: string]: typeof PrimitiveTypes[number] } = {
	TSNumberKeyword: 'number',
	TSObjectKeyword: 'object',
	TSBooleanKeyword: 'boolean',
	TSStringKeyword: 'string',
	TSSymbolKeyword: 'symbol',
	TSAnyKeyword: 'any',
	TSUnknownKeyword: 'unknown',
	TSVoidKeyword: 'void',
	TSNeverKeyword: 'never',
	TSUndefinedKeyword: 'undefined',
	TSNullKeyword: 'null'
}

export interface TypeOfPropPrimitive {
	name: typeof PrimitiveTypes[number]
}

export interface TypeOfPropLiteral {
	name: 'literal'
	value: string | number | boolean
}

export interface TypeOfPropArray {
	name: 'array'
	elements?: TypeOfProp[]
}

export interface TypeOfPropUnion {
	name: 'union' | 'intersection'
	elements: TypeOfProp[]
}

/**
 * When no other type fits, display the code as it is in the original file
 */
export interface TypeOfPropCode {
	name: 'code'
	code: string
}

export interface TypeOfPropSignature {
	name: 'signature'
	properties?: PropDescriptor[]
}

export type TypeOfProp =
	| TypeOfPropPrimitive
	| TypeOfPropLiteral
	| TypeOfPropArray
	| TypeOfPropUnion
	| TypeOfPropCode
	| TypeOfPropSignature

export interface PropDescriptor extends Descriptor {
	type?: TypeOfProp
	description?: string
	required?: boolean
	defaultValue?: { value: string; func?: boolean }
	tags?: { [title: string]: BlockTag[] }
	values?: string[]
	name: string
}

export interface MethodDescriptor extends Descriptor {
	name: string
	description?: string
	returns?: UnnamedParam
	throws?: UnnamedParam
	tags?: { [key: string]: BlockTag[] }
	params?: Param[]
	modifiers?: string[]
	[key: string]: any
}

export interface SlotDescriptor extends Descriptor {
	name: string
	description?: string
	bindings?: ParamTag[]
	scoped?: boolean
	tags?: { [key: string]: BlockTag[] }
}

export interface ExposedDescriptor extends Descriptor {
	name: string
	description?: string
	tags?: { [key: string]: BlockTag[] }
}

export interface ComponentDoc {
	displayName: string
	exportName: string
	description?: string
	props?: PropDescriptor[]
	methods?: MethodDescriptor[]
	slots?: SlotDescriptor[]
	events?: EventDescriptor[]
	tags?: { [key: string]: BlockTag[] }
	docsBlocks?: string[]
	[key: string]: any
}
