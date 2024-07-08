import * as bt from '@babel/types'
import * as path from 'path'
import { visit } from 'ast-types'
import { NodePath } from 'ast-types/lib/node-path'
import type { ParseOptions } from '../../types'
import makePathResolver from '../../utils/makePathResolver'
import resolveRequired from '../../utils/resolveRequired'
import recursiveResolveIEV from '../../utils/recursiveResolveIEV'
import getPathOfExportedValue from '../../utils/getPathFromExportedValue'

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

export default async function parseValidatorForValues(
	validatorNode: bt.Method | bt.ArrowFunctionExpression,
	ast: bt.File,
	options: ParseOptions
): Promise<string[] | undefined> {
	/**
	 * Resolves a variable value from its identifier (name)
	 * @param identifierName
	 */
	async function resolveValueFromIdentifier(identifierName: string): Promise<string[] | undefined> {
		let varPath: NodePath | undefined
		visit(ast, {
			visitVariableDeclaration(p) {
				p.node.declarations.forEach((decl, i) => {
					if (
						decl.type === 'VariableDeclarator' &&
						decl.id.type === 'Identifier' &&
						decl.id.name === identifierName
					) {
						varPath = p.get('declarations', i, 'init')
					}
				})
				return false
			}
		})
		if (varPath && bt.isArrayExpression(varPath.node)) {
			return varPath.node.elements.map((e: bt.StringLiteral) => e.value).filter(e => e)
		}
		const varToFilePath = resolveRequired(ast, [identifierName])
		const originalDirName = path.dirname(options.filePath)
		const pathResolver = makePathResolver(originalDirName, options.alias, options.modules)

		// resolve where sources are through immediately exported variables
		await recursiveResolveIEV(pathResolver, varToFilePath, options.validExtends)

		if (varToFilePath[identifierName]) {
			// load value found from read file
			const { exportName, filePath } = varToFilePath[identifierName]
			const p = await getPathOfExportedValue(pathResolver, exportName, filePath, options)
			if (p && bt.isArrayExpression(p.node)) {
				return p.node.elements.map((e: bt.StringLiteral) => e.value).filter(e => e)
			}
		}
		return undefined
	}

	async function extractStringArray(
		valuesObjectNode: bt.Expression
	): Promise<string[] | undefined> {
		return bt.isIdentifier(valuesObjectNode)
			? await resolveValueFromIdentifier(valuesObjectNode.name)
			: bt.isArrayExpression(valuesObjectNode)
			? valuesObjectNode.elements.map((e: bt.StringLiteral) => e.value).filter(e => e)
			: undefined
	}

	const returnedExpression =
		(bt.isMethod(validatorNode) || bt.isFunctionExpression(validatorNode)) &&
		validatorNode.body.body.length === 1 &&
		bt.isReturnStatement(validatorNode.body.body[0])
			? validatorNode.body.body[0].argument
			: bt.isArrowFunctionExpression(validatorNode)
			? validatorNode.body
			: undefined

	const varName =
		validatorNode.params && bt.isIdentifier(validatorNode.params[0])
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
				return undefined
		}

		const values: string[] | undefined =
			bt.isCallExpression(valuesNode) &&
			bt.isIdentifier(valuesNode.arguments[0]) &&
			varName === valuesNode.arguments[0].name &&
			bt.isMemberExpression(valuesNode.callee) &&
			bt.isIdentifier(valuesNode.callee.property) &&
			valuesNode.callee.property.name === 'indexOf'
				? await extractStringArray(valuesNode.callee.object)
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
	return undefined
}
