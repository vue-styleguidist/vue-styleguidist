import { Node, TemplateChildNode } from '@vue/compiler-dom'
import { isCommentNode, isInterpolationNode, isSimpleExpressionNode, isTextNode } from './guards'

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
	// if the item has no siblings, the item is not documented
	if (siblings.length < 1) {
		return []
	}

	// First find the position of the item in the siblings list
	let i = siblings.length - 1
	let currentSlotIndex = -1
	do {
		if (siblings[i] === templateAst) {
			currentSlotIndex = i
		}
	} while (currentSlotIndex < 0 && i--)

	// Find the first leading comment
	// get all siblings before the current node
	const slotSiblingsBeforeSlot = siblings
		.slice(0, currentSlotIndex)
		.filter(s => !isTextNode(s))
		.reverse()

	// find the first node that is not a potential comment
	const indexLastComment = slotSiblingsBeforeSlot.findIndex(
		sibling =>
			!isCommentNode(sibling) &&
			!(
				isInterpolationNode(sibling) &&
				isSimpleExpressionNode(sibling.content) &&
				isCodeOnlyJSComment(sibling.content.content)
			)
	)

	// cut the comments array on this index
	const slotLeadingComments = (
		indexLastComment > 0
			? slotSiblingsBeforeSlot.slice(0, indexLastComment)
			: slotSiblingsBeforeSlot
	)
		.reverse()
		.filter(s => isCommentNode(s) || isInterpolationNode(s))

	// return each comment text
	return slotLeadingComments.map(comment =>
		isCommentNode(comment)
			? comment.content.trim()
			: isInterpolationNode(comment) && isSimpleExpressionNode(comment.content)
			? cleanUpComment(comment.content.content.trim())
			: ''
	)
}

function isCodeOnlyJSComment(code: string): boolean {
	const codeTrimmed = code.trim()
	return (
		// check single-line comments
		isCodeOnlyJSCommentSingleLine(codeTrimmed) ||
		// check multi-line comments
		isCodeOnlyJSCommentMultiLine(codeTrimmed)
	)
}

function isCodeOnlyJSCommentSingleLine(code: string): boolean {
	return code.split('\n').every(line => line.startsWith('//'))
}

function isCodeOnlyJSCommentMultiLine(code: string): boolean {
	return (
		code.startsWith('/*') &&
		code.endsWith('*/') &&
		// avoid picking up comments that have multiple blocks
		code.slice(2, -2).indexOf('*/') === -1
	)
}

function cleanUpComment(comment: string): string {
	return isCodeOnlyJSCommentMultiLine(comment)
		? comment.slice(2, -2)
		: comment
				.trim()
				.slice(2)
				.split(/\n\/\//g)
				.join('\n')
}
