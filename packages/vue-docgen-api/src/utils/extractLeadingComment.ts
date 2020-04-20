import { NodeTypes, CommentNode, BaseElementNode } from '@vue/compiler-dom'

function isCommentNode(node: any): node is CommentNode {
	return node.type === NodeTypes.COMMENT
}

/**
 * Extract leading comments to an html node
 * Even if the comment is on multiple lines it's still taken as a whole
 * @param templateAst
 * @param rootLeadingComment
 */
export default function extractLeadingComment(
	parentAst: BaseElementNode | undefined,
	templateAst: BaseElementNode,
	rootLeadingComments: string[]
): string[] {
	if (parentAst) {
		const slotSiblings = parentAst.children
		// if the slot has no comment siblings, the slot is not documented
		if (slotSiblings.length < 1) {
			return []
		}
		// First find the position of the slot in the list
		let i = slotSiblings.length - 1
		let currentSlotIndex = -1
		do {
			if (slotSiblings[i] === templateAst) {
				currentSlotIndex = i
			}
		} while (currentSlotIndex < 0 && i--)

		// Find the first leading comment
		// get all siblings before the current node
		const slotSiblingsBeforeSlot = slotSiblings.slice(0, currentSlotIndex).reverse()

		// find the first node that is not a potential comment
		const indexLastComment = slotSiblingsBeforeSlot.findIndex(
			sibling => !isCommentNode(sibling) || !sibling.content
		)

		// cut the comments array on this index
		const slotLeadingComments = ((indexLastComment > 0
			? slotSiblingsBeforeSlot.slice(0, indexLastComment)
			: slotSiblingsBeforeSlot
		).reverse() as unknown) as CommentNode[]

		// return each comment text
		return slotLeadingComments.map(comment => comment.content.trim())
	} else if (rootLeadingComments.length) {
		return rootLeadingComments
	}
	return []
}
