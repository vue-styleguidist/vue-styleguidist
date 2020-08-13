import * as bt from '@babel/types'

/**
 * Determines if node contains the value -1
 * @param node
 */
function isMinusOne(node: bt.Expression): boolean {
	return (
		bt.isUnaryExpression(node) &&
		node.operator === '-' &&
		bt.isNumericLiteral(node.argument) &&
		node.argument.value === 1
	)
}

function extractStringArray(valuesObjectNode: bt.Expression): string[] | undefined {
	return bt.isArrayExpression(valuesObjectNode)
		? valuesObjectNode.elements.map((e: bt.StringLiteral) => e.value).filter(e => e)
		: undefined
}

export default function parseValidatorForValues(
	validatorNode: bt.Method | bt.ArrowFunctionExpression
): string[] | undefined {
	const returnedExpression =
		bt.isMethod(validatorNode) &&
		validatorNode.body.body.length === 1 &&
		bt.isReturnStatement(validatorNode.body.body[0])
			? validatorNode.body.body[0].argument
			: bt.isArrowFunctionExpression(validatorNode)
			? validatorNode.body
			: undefined

	const varName = bt.isIdentifier(validatorNode.params[0])
		? validatorNode.params[0].name
		: undefined

	if (bt.isBinaryExpression(returnedExpression)) {
		let valuesNode: bt.Node | undefined

		switch (returnedExpression.operator) {
			case '>':
				if (isMinusOne(returnedExpression.right)) {
					valuesNode = returnedExpression.left
				}
				break

			case '<':
				if (bt.isExpression(returnedExpression.left) && isMinusOne(returnedExpression.left)) {
					valuesNode = returnedExpression.right
				}
				break
			case '!==':
			case '!=':
				if (bt.isExpression(returnedExpression.left) && isMinusOne(returnedExpression.left)) {
					valuesNode = returnedExpression.right
				} else if (isMinusOne(returnedExpression.right)) {
					valuesNode = returnedExpression.left
				}
				break
			default:
				return
		}

		const values: string[] | undefined =
			bt.isCallExpression(valuesNode) &&
			bt.isIdentifier(valuesNode.arguments[0]) &&
			varName === valuesNode.arguments[0].name &&
			bt.isMemberExpression(valuesNode.callee) &&
			bt.isIdentifier(valuesNode.callee.property) &&
			valuesNode.callee.property.name === 'indexOf'
				? extractStringArray(valuesNode.callee.object)
				: undefined
		return values
	} else if (bt.isCallExpression(returnedExpression)) {
		if (
			bt.isMemberExpression(returnedExpression.callee) &&
			bt.isIdentifier(returnedExpression.callee.property) &&
			returnedExpression.callee.property.name === 'includes'
		) {
			return extractStringArray(returnedExpression.callee.object)
		}
	}
	return
}
