import { ASTElement, ASTNode, ASTText } from 'vue-template-compiler'

/**
 * Extract leading comments to an html node
 * Even if the comment is on multiple lines it's still taken as a whole
 * @param templateAst
 * @param rootLeadingComment
 */
export default function extractLeadingComment(
	parentAst: ASTElement | undefined,
	templateAst: ASTNode,
	rootLeadingComments: string[]
): string[] {
	if (parentAst) {
		const slotSiblings: ASTNode[] = parentAst.children
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
			sibling => sibling.type !== 3 || (!sibling.isComment && sibling.text.trim().length)
		)

		// cut the comments array on this index
		const slotPotentialComments = (indexLastComment > 0
			? slotSiblingsBeforeSlot.slice(0, indexLastComment)
			: slotSiblingsBeforeSlot
		).reverse() as ASTText[]

		// return each comment text
		return slotPotentialComments
			.filter(pc => pc.isComment)
			.map(potentialComment => potentialComment.text.trim())
	} else if (rootLeadingComments.length) {
		return rootLeadingComments
	}
	return []
}
