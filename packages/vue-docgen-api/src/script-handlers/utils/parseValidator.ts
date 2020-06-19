import * as bt from '@babel/types'

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

	const varName = bt.isIdentifier(validatorNode.params[0]) ? validatorNode.params[0].name : undefined

	if (bt.isBinaryExpression(returnedExpression)) {
		let valuesNode: bt.Node | undefined

		switch (returnedExpression.operator) {
			case '>':
				if (
					bt.isUnaryExpression(returnedExpression.right) &&
					returnedExpression.right.operator === '-' &&
					bt.isNumericLiteral(returnedExpression.right.argument) &&
					returnedExpression.right.argument.value === 1
				) {
					valuesNode = returnedExpression.left
				}
				break

			case '<':
				if (
					bt.isUnaryExpression(returnedExpression.left) &&
					returnedExpression.left.operator === '-' &&
					bt.isNumericLiteral(returnedExpression.left.argument) &&
					returnedExpression.left.argument.value === 1
				) {
					valuesNode = returnedExpression.right
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
			valuesNode.callee.property.name === 'indexOf' &&
			bt.isArrayExpression(valuesNode.callee.object)
				? valuesNode.callee.object.elements.map((e: bt.StringLiteral) => e.value)
				: undefined
		return values
	}
	return
}
