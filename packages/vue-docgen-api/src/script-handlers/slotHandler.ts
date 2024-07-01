import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import { visit } from 'recast'
import Documentation, { ParamTag, ParamType, Tag, SlotDescriptor } from '../Documentation'
import getDoclets from '../utils/getDoclets'
import { parseDocblock } from '../utils/getDocblock'
import transformTagsIntoObject from '../utils/transformTagsIntoObject'
import getProperties from './utils/getProperties'

export interface TypedParamTag extends ParamTag {
	type: ParamType
}

/**
 * Extract slots information form the render function of an object-style VueJs component
 * @param documentation
 * @param path
 */
export default function slotHandler(documentation: Documentation, path: NodePath): Promise<void> {
	if (bt.isObjectExpression(path.node)) {
		const renderPath = getProperties(path, 'render')

		// if no prop return
		if (!renderPath.length) {
			return Promise.resolve()
		}

		const renderValuePath = bt.isObjectProperty(renderPath[0].node)
			? renderPath[0].get('value')
			: renderPath[0]
		visit(renderValuePath.node, {
			// this.$slots.default()
			visitCallExpression(pathCall) {
				if (
					pathCall.node.callee.type === 'MemberExpression' &&
					pathCall.node.callee.object.type === 'MemberExpression' &&
					pathCall.node.callee.object.object.type === 'ThisExpression' &&
					pathCall.node.callee.property.type === 'Identifier' &&
					pathCall.node.callee.object.property.type === 'Identifier' &&
					(pathCall.node.callee.object.property.name === '$slots' ||
						pathCall.node.callee.object.property.name === '$scopedSlots')
				) {
					const doc = documentation.getSlotDescriptor(pathCall.node.callee.property.name)
					const comment = getSlotComment(pathCall, doc)
					const bindings = pathCall.node.arguments[0]
					if (bindings?.type === 'ObjectExpression' && bindings.properties.length) {
						doc.bindings = getBindings(
							bindings as bt.ObjectExpression,
							comment ? comment.bindings : undefined
						)
					}
					return false
				}
				this.traverse(pathCall)
				return undefined
			},
			// this.$slots.mySlot
			visitMemberExpression(pathMember) {
				if (
					pathMember.node.object.type === 'MemberExpression' &&
					pathMember.node.object.object.type === 'ThisExpression' &&
					pathMember.node.object.property.type === 'Identifier' &&
					(pathMember.node.object.property.name === '$slots' ||
						pathMember.node.object.property.name === '$scopedSlots') &&
					pathMember.node.property.type === 'Identifier'
				) {
					const doc = documentation.getSlotDescriptor(pathMember.node.property.name)
					getSlotComment(pathMember, doc)
					return false
				}
				this.traverse(pathMember)
				return undefined
			},
			visitJSXElement(pathJSX) {
				const tagName = pathJSX.node.openingElement.name
				const nodeJSX = pathJSX.node as bt.JSXElement
				if (tagName.type === 'JSXIdentifier' && tagName.name === 'slot') {
					const doc = documentation.getSlotDescriptor(getName(nodeJSX))
					const parentNode = pathJSX.parentPath.node
					let comment: SlotComment | undefined
					if (bt.isJSXElement(parentNode)) {
						comment = getJSXDescription(nodeJSX, parentNode.children, doc)
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
				return undefined
			}
		})
	}
	return Promise.resolve()
}

function isStatement(path: NodePath): boolean {
	return (
		path &&
		(bt.isDeclaration(path.node) || bt.isReturnStatement(path.node) || bt.isIfStatement(path.node))
	)
}

function getName(nodeJSX: bt.JSXElement): string {
	const oe = nodeJSX.openingElement
	const names = oe.attributes.filter(
		(a: bt.JSXAttribute) => bt.isJSXAttribute(a) && a.name.name === 'name'
	) as bt.JSXAttribute[]

	const nameNode = names.length ? names[0].value : null
	return nameNode && bt.isStringLiteral(nameNode) ? nameNode.value : 'default'
}

type SlotComment = Pick<SlotDescriptor, 'bindings'>

function getJSXDescription(
	nodeJSX: bt.JSXElement,
	siblings: bt.Node[],
	descriptor: SlotDescriptor
): SlotComment | undefined {
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

	return parseCommentNode(lastComment, descriptor)
}

export function getSlotComment(
	path: NodePath,
	descriptor: SlotDescriptor
): SlotComment | undefined {
	const desc = getExpressionDescription(path, descriptor)
	if (desc) {
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
	return path ? getExpressionDescription(path, descriptor) : undefined
}

function getExpressionDescription(
	path: NodePath,
	descriptor: SlotDescriptor
): SlotComment | undefined {
	const node = path.node
	if (!node || !node.leadingComments || node.leadingComments.length === 0) {
		return undefined
	}

	return parseCommentNode(node.leadingComments[node.leadingComments.length - 1], descriptor)
}

function parseCommentNode(node: bt.Comment, descriptor: SlotDescriptor): SlotComment | undefined {
	if (node.type !== 'CommentBlock') {
		return undefined
	}
	return parseSlotDocBlock(node.value, descriptor)
}

export function parseSlotDocBlock(str: string, descriptor: SlotDescriptor) {
	const docBlock = parseDocblock(str).trim()
	const jsDoc = getDoclets(docBlock)
	if (!jsDoc.tags?.length) {
		return undefined
	}
	const slotTags = jsDoc.tags.filter(t => t.title === 'slot')
	if (slotTags.length) {
		const tagContent = (slotTags[0] as Tag).content
		const description = typeof tagContent === 'string' ? tagContent : undefined
		if (description && (!descriptor.description || !descriptor.description.length)) {
			descriptor.description = description

			const fixedNameMatch = description.match(/^(\S+) - (.*)$/)

			if (fixedNameMatch) {
				descriptor.name = fixedNameMatch[1]
				descriptor.description = fixedNameMatch[2]
			}
		}
		const tags = jsDoc.tags.filter(t => t.title !== 'slot' && t.title !== 'binding')
		if (tags.length) {
			descriptor.tags = transformTagsIntoObject(tags)
		}
		return {
			bindings: jsDoc.tags.filter(t => t.title === 'binding')
		}
	}
	return undefined
}

function getBindings(
	node: bt.ObjectExpression,
	bindingsFromComments: ParamTag[] | undefined
): ParamTag[] {
	return node.properties.reduce((bindings: ParamTag[], prop: bt.ObjectProperty) => {
		if (bt.isIdentifier(prop.key)) {
			const name = prop.key.name
			const description: string | boolean | undefined =
				prop.leadingComments && prop.leadingComments.length
					? parseDocblock(prop.leadingComments[prop.leadingComments.length - 1].value)
					: undefined
			if (!description) {
				const descbinding = bindingsFromComments
					? bindingsFromComments.filter(b => b.name === name)[0]
					: undefined
				if (descbinding) {
					bindings.push(descbinding)
					return bindings
				}
			} else {
				bindings.push({
					title: 'binding',
					name,
					description
				})
			}
		}

		return bindings
	}, [])
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
