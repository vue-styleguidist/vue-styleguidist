import {
	Node,
	NodeTypes,
	BaseElementNode,
	DirectiveNode,
	SimpleExpressionNode,
	CompoundExpressionNode,
	InterpolationNode,
	CommentNode,
	AttributeNode
} from '@vue/compiler-dom'

export function isCommentNode(node: any): node is CommentNode {
	return node.type === NodeTypes.COMMENT
}

export function isBaseElementNode(node?: Node): node is BaseElementNode {
	return !!node && node.type === NodeTypes.ELEMENT
}

export function isDirectiveNode(prop?: Node): prop is DirectiveNode {
	return !!prop && prop.type === NodeTypes.DIRECTIVE
}

export function isAttributeNode(prop?: Node): prop is AttributeNode {
	return !!prop && prop.type === NodeTypes.ATTRIBUTE
}

export function isSimpleExpressionNode(exp?: Node): exp is SimpleExpressionNode {
	return !!exp && exp.type === NodeTypes.SIMPLE_EXPRESSION
}

export function isCompoundExpressionNode(exp?: Node): exp is CompoundExpressionNode {
	return !!exp && exp.type === NodeTypes.COMPOUND_EXPRESSION
}

export function isInterpolationNode(exp?: Node): exp is InterpolationNode {
	return !!exp && exp.type === NodeTypes.INTERPOLATION
}
