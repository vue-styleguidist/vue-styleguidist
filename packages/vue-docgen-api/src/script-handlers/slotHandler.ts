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
					const comment = getSlotComment(pathCall)
					if (comment && (!doc.description || !doc.description.length)) {
						doc.description = comment.description
					}
					const bindings = pathCall.node.arguments[0]
					if (bt.isObjectExpression(bindings) && bindings.properties.length) {
						doc.bindings = getBindings(bindings, comment ? comment.bindings : undefined)
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
					const comment = getSlotComment(pathMember)
					const doc = documentation.getSlotDescriptor(pathMember.node.property.name)
					if (comment && comment.description) {
						doc.description = comment.description
					}
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
					let comment: SlotComment | undefined
					if (bt.isJSXElement(parentNode)) {
						comment = getJSXDescription(nodeJSX, parentNode.children)
						if (comment) {
							doc.description = comment.description
						}
					}
					const bindings = nodeJSX.openingElement.attributes
					if (bindings && bindings.length) {
						doc.bindings = bindings.map((b: bt.JSXAttribute) =>
							getBindingsFromJSX(b, comment ? comment.bindings : undefined)
						)
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

type SlotComment = {
	description?: string
	bindings?: ParamTag[]
}

function getJSXDescription(nodeJSX: bt.JSXElement, siblings: bt.Node[]): SlotComment | undefined {
	if (!siblings) {
		return undefined
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
		return undefined
	}
	const cmts = commentExpression.expression.innerComments
	const lastComment = cmts[cmts.length - 1]

	return parseCommentNode(lastComment)
}

function getSlotComment(path: NodePath): SlotComment | undefined {
	const desc = getExpressionDescription(path)
	if (desc && desc.description && desc.description.length) {
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
	return path ? getExpressionDescription(path) : undefined
}

function getExpressionDescription(path: NodePath): SlotComment | undefined {
	const node = path.node
	if (!node.leadingComments || node.leadingComments.length === 0) {
		return undefined
	}

	return parseCommentNode(node.leadingComments[node.leadingComments.length - 1])
}

function parseCommentNode(node: bt.Comment): SlotComment | undefined {
	if (node.type !== 'CommentBlock') {
		return undefined
	}
	const docBlock = parseDocblock(node.value).trim()
	const jsDoc = getDoclets(docBlock)
	if (!jsDoc.tags) {
		return undefined
	}
	const slotTags = jsDoc.tags.filter(t => t.title === 'slot')
	if (slotTags.length) {
		const tagContent = (slotTags[0] as Tag).content
		return typeof tagContent === 'string'
			? { description: tagContent, bindings: jsDoc.tags.filter(t => t.title === 'binding') }
			: undefined
	}
	return undefined
}

function getBindings(node: bt.ObjectExpression, bindings: ParamTag[] | undefined): ParamTag[] {
	return node.properties.map((prop: bt.ObjectProperty) => {
		const name = prop.key.name
		const description: string | boolean | undefined =
			prop.leadingComments && prop.leadingComments.length
				? parseDocblock(prop.leadingComments[prop.leadingComments.length - 1].value)
				: undefined
		if (!description) {
			const descbinding = bindings ? bindings.filter(b => b.name === name)[0] : undefined
			if (descbinding) {
				return descbinding
			}
		}
		return {
			title: 'binding',
			name,
			description
		}
	})
}

function getBindingsFromJSX(attr: bt.JSXAttribute, bindings: ParamTag[] | undefined): ParamTag {
	const name = attr.name.name as string
	const descbinding = bindings ? bindings.filter(b => b.name === name)[0] : undefined
	if (descbinding) {
		return descbinding
	}
	return {
		title: 'binding',
		name
	}
}
