import { ASTElement, ASTNode } from 'vue-template-compiler'

/**
 * Extract leading comments to an html node
 * Even if the comment is on multiple lines it's still taken as a whole
 * @param templateAst
 * @param rootLeadingComment
 */
export default function extractLeadingComment(
  parentAst: ASTElement | undefined,
  templateAst: ASTNode,
  rootLeadingComment: string,
): string {
  let comment = ''
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
    const slotSiblingsBeforeSlot = slotSiblings.slice(0, currentSlotIndex).reverse()

    for (const potentialComment of slotSiblingsBeforeSlot) {
      // if there is text between the slot and the comment, ignore
      if (
        potentialComment.type !== 3 ||
        (!potentialComment.isComment && potentialComment.text.trim().length)
      ) {
        break
      }

      if (potentialComment.isComment) {
        comment = potentialComment.text.trim() + '\n' + comment
      }
    }
  } else if (rootLeadingComment.length) {
    comment = rootLeadingComment
  }
  return comment.trim()
}
