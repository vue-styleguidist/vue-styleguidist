import {
	Node,
	BaseElementNode,
	DirectiveNode,
	SimpleExpressionNode,
	CompoundExpressionNode,
	InterpolationNode,
	CommentNode,
	AttributeNode,
	TextNode
} from '@vue/compiler-dom'

const NodeTypesLitteral = {
	ELEMENT: 1,
	TEXT: 2,
	COMMENT: 3,
	SIMPLE_EXPRESSION: 4,
	INTERPOLATION: 5,
	ATTRIBUTE: 6,
	DIRECTIVE: 7,
	COMPOUND_EXPRESSION: 8
} as const

export function isTextNode(node?: Node): node is TextNode {
	return !!node && node.type === NodeTypesLitteral.TEXT
}

export function isCommentNode(node?: Node): node is CommentNode {
	return !!node && node.type === NodeTypesLitteral.COMMENT
}

export function isBaseElementNode(node?: Node): node is BaseElementNode {
	return !!node && node.type === NodeTypesLitteral.ELEMENT
}

export function isDirectiveNode(prop?: Node): prop is DirectiveNode {
	return !!prop && prop.type === NodeTypesLitteral.DIRECTIVE
}

export function isAttributeNode(prop?: Node): prop is AttributeNode {
	return !!prop && prop.type === NodeTypesLitteral.ATTRIBUTE
}

export function isSimpleExpressionNode(exp?: Node): exp is SimpleExpressionNode {
	return !!exp && exp.type === NodeTypesLitteral.SIMPLE_EXPRESSION
}

export function isCompoundExpressionNode(exp?: Node): exp is CompoundExpressionNode {
	return !!exp && exp.type === NodeTypesLitteral.COMPOUND_EXPRESSION
}

export function isInterpolationNode(exp?: Node): exp is InterpolationNode {
	return !!exp && exp.type === NodeTypesLitteral.INTERPOLATION
}
