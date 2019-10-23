import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import recast from 'recast'
import Documentation, { ParamTag, ParamType, Tag } from '../Documentation'
import getDoclets from '../utils/getDoclets'
import { parseDocblock } from '../utils/getDocblock'

export interface TypedParamTag extends ParamTag {
	type: ParamType
}

export default async function slotHandler(documentation: Documentation, path: NodePath) {
	if (bt.isObjectExpression(path.node)) {
		const renderPath = path
			.get('properties')
			.filter(
				(p: NodePath) =>
					(bt.isObjectProperty(p.node) || bt.isObjectMethod(p.node)) && p.node.key.name === 'render'
			)

		// if no prop return
		if (!renderPath.length) {
			return
		}

		const renderValuePath = bt.isObjectProperty(renderPath[0].node)
			? renderPath[0].get('value')
			: renderPath[0]
		recast.visit(renderValuePath.node, {
			// this.$slots.default()
			visitCallExpression(pathCall) {
				if (
					bt.isMemberExpression(pathCall.node.callee) &&
					bt.isMemberExpression(pathCall.node.callee.object) &&
					bt.isThisExpression(pathCall.node.callee.object.object) &&
					bt.isIdentifier(pathCall.node.callee.property) &&
					(pathCall.node.callee.object.property.name === '$slots' ||
						pathCall.node.callee.object.property.name === '$scopedSlots')
				) {
					const doc = documentation.getSlotDescriptor(pathCall.node.callee.property.name)
					if (!doc.description || !doc.description.length) {
						doc.description = getDescription(pathCall)
					}
					const bindings = pathCall.node.arguments[0]
					if (bt.isObjectExpression(bindings)) {
						doc.bindings = getBindings(bindings)
					}
					return false
				}
				this.traverse(pathCall)
			},
			// this.$slots.mySlot
			visitMemberExpression(pathMember) {
				if (
					bt.isMemberExpression(pathMember.node.object) &&
					bt.isThisExpression(pathMember.node.object.object) &&
					bt.isIdentifier(pathMember.node.object.property) &&
					(pathMember.node.object.property.name === '$slots' ||
						pathMember.node.object.property.name === '$scopedSlots') &&
					bt.isIdentifier(pathMember.node.property)
				) {
					const doc = documentation.getSlotDescriptor(pathMember.node.property.name)
					doc.description = getDescription(pathMember)

					return false
				}
				this.traverse(pathMember)
			},
			visitJSXElement(pathJSX) {
				const tagName = pathJSX.node.openingElement.name
				const nodeJSX = pathJSX.node
				if (!bt.isJSXElement(nodeJSX)) {
					this.traverse(pathJSX)
					return
				}
				if (bt.isJSXIdentifier(tagName) && tagName.name === 'slot') {
					const doc = documentation.getSlotDescriptor(getName(nodeJSX))
					const parentNode = pathJSX.parentPath.node
					if (bt.isJSXElement(parentNode)) {
						doc.description = getJSXDescription(nodeJSX, parentNode.children)
					}
					return false
				}
				this.traverse(pathJSX)
			}
		})
	}
}

function isStatement(path: NodePath): boolean {
	return path && (bt.isDeclaration(path.node) || bt.isReturnStatement(path.node))
}

function getName(nodeJSX: bt.JSXElement): string {
	const oe = nodeJSX.openingElement
	const names = oe.attributes.filter(
		(a: bt.JSXAttribute) => bt.isJSXAttribute(a) && a.name.name === 'name'
	) as bt.JSXAttribute[]

	const nameNode = names.length ? names[0].value : null
	return nameNode && bt.isStringLiteral(nameNode) ? nameNode.value : 'default'
}

function getJSXDescription(nodeJSX: bt.JSXElement, siblings: bt.Node[]): string {
	if (!siblings) {
		return ''
	}
	const indexInParent = siblings.indexOf(nodeJSX)

	let commentExpression: bt.JSXExpressionContainer | null = null
	for (let i = indexInParent - 1; i > -1; i--) {
		const currentNode = siblings[i]
		if (bt.isJSXExpressionContainer(currentNode)) {
			commentExpression = currentNode
			break
		}
	}
	if (!commentExpression || !commentExpression.expression.innerComments) {
		return ''
	}
	const cmts = commentExpression.expression.innerComments
	const lastComment = cmts[cmts.length - 1]

	return parseCommentNode(lastComment)
}

function getDescription(path: NodePath): string {
	const desc = getExpressionDescription(path)
	if (desc.length) {
		return desc
	}
	// in case we don't find a description on the expression,
	// look for it on the containing statement

	// 1: find the statement
	let i = 10
	while (i-- && path && !isStatement(path)) {
		path = path.parentPath
	}

	// 2: extract the description if it exists
	return path ? getExpressionDescription(path) : ''
}

function getExpressionDescription(path: NodePath): string {
	const node = path.node
	if (!node.leadingComments || node.leadingComments.length === 0) {
		return ''
	}

	return parseCommentNode(node.leadingComments[node.leadingComments.length - 1])
}

function parseCommentNode(node: bt.BaseComment): string {
	if (node.type !== 'CommentBlock') {
		return ''
	}
	const docBlock = parseDocblock(node.value).trim()
	const jsDoc = getDoclets(docBlock)
	if (!jsDoc.tags) {
		return ''
	}
	const slotTags = jsDoc.tags.filter(t => t.title === 'slot')
	if (slotTags.length) {
		const tagContent = (slotTags[0] as Tag).content
		return typeof tagContent === 'string' ? tagContent : ''
	}
	return ''
}

function getBindings(node: bt.ObjectExpression): Record<string, any> {
	return node.properties.reduce((bindings: Record<string, any>, prop: bt.ObjectProperty) => {
		const desc =
			prop.leadingComments && prop.leadingComments.length
				? parseDocblock(prop.leadingComments[prop.leadingComments.length - 1].value)
				: undefined
		bindings[prop.key.name] = desc || '-'
		return bindings
	}, {})
}
