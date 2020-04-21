import { Node, TemplateChildNode } from '@vue/compiler-dom'
import { isCommentNode } from './guards'

/**
 * Extract leading comments to an html node
 * Even if the comment is on multiple lines it's still taken as a whole
 * @param templateAst
 * @param rootLeadingComment
 */
export default function extractLeadingComment(
	siblings: TemplateChildNode[],
	templateAst: Node
): string[] {
	// if the slot has no comment siblings, the slot is not documented
	if (siblings.length < 1) {
		return []
	}
	// First find the position of the slot in the list
	let i = siblings.length - 1
	let currentSlotIndex = -1
	do {
		if (siblings[i] === templateAst) {
			currentSlotIndex = i
		}
	} while (currentSlotIndex < 0 && i--)

	// Find the first leading comment
	// get all siblings before the current node
	const slotSiblingsBeforeSlot = siblings.slice(0, currentSlotIndex).reverse()

	// find the first node that is not a potential comment
	const indexLastComment = slotSiblingsBeforeSlot.findIndex(sibling => !isCommentNode(sibling))

	// cut the comments array on this index
	const slotLeadingComments = (indexLastComment > 0
		? slotSiblingsBeforeSlot.slice(0, indexLastComment)
		: slotSiblingsBeforeSlot
	)
		.reverse()
		.filter(isCommentNode)

	// return each comment text
	return slotLeadingComments.map(comment => comment.content.trim())
}
