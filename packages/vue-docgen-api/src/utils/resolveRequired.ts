import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import recast from 'recast'

interface ImportedVariable {
	// an imported variable can have mutiple potential filepath
	// when it is not imported explicitely but using export * from "path"
	filePath: string[]
	exportName: string
}

export interface ImportedVariableSet {
	[key: string]: ImportedVariable
}

/**
 *
 * @param ast
 * @param varNameFilter
 */
export default function resolveRequired(
	ast: bt.File,
	varNameFilter?: string[]
): ImportedVariableSet {
	const varToFilePath: ImportedVariableSet = {}

	recast.visit(ast.program, {
		visitImportDeclaration(astPath: NodePath) {
			const specifiers = astPath.get('specifiers')

			// if `import 'module'` without variable name cannot be a mixin
			specifiers.each((sp: NodePath) => {
				const nodeSpecifier = sp.node
				if (bt.isImportDefaultSpecifier(nodeSpecifier) || bt.isImportSpecifier(nodeSpecifier)) {
					const localVariableName = nodeSpecifier.local.name

					const exportName = bt.isImportDefaultSpecifier(nodeSpecifier)
						? 'default'
						: nodeSpecifier.imported.name

					if (!varNameFilter || varNameFilter.indexOf(localVariableName) > -1) {
						const nodeSource = (astPath.get('source') as NodePath<bt.Literal>).node
						if (bt.isStringLiteral(nodeSource)) {
							const filePath = [nodeSource.value]
							varToFilePath[localVariableName] = {
								filePath,
								exportName
							}
						}
					}
				}
			})
			return false
		},

		visitVariableDeclaration(astPath: NodePath) {
			// only look at variable declarations
			if (!bt.isVariableDeclaration(astPath.node)) {
				return false
			}
			astPath.node.declarations.forEach(nodeDeclaration => {
				let sourceNode: bt.Node
				let source: string = ''

				const { init, exportName } =
					nodeDeclaration.init && bt.isMemberExpression(nodeDeclaration.init)
						? {
								init: nodeDeclaration.init.object,
								exportName: bt.isIdentifier(nodeDeclaration.init.property)
									? nodeDeclaration.init.property.name
									: 'default'
						  }
						: { init: nodeDeclaration.init, exportName: 'default' }
				if (!init) {
					return
				}

				if (bt.isCallExpression(init)) {
					if (!bt.isIdentifier(init.callee) || init.callee.name !== 'require') {
						return
					}
					sourceNode = init.arguments[0]
					if (!bt.isStringLiteral(sourceNode)) {
						return
					}
					source = sourceNode.value
				} else {
					return
				}

				if (bt.isIdentifier(nodeDeclaration.id)) {
					const varName = nodeDeclaration.id.name
					varToFilePath[varName] = { filePath: [source], exportName }
				} else if (bt.isObjectPattern(nodeDeclaration.id)) {
					nodeDeclaration.id.properties.forEach((p: bt.ObjectProperty) => {
						const varName = p.key.name
						varToFilePath[varName] = { filePath: [source], exportName }
					})
				} else {
					return
				}
			})
			return false
		}
	})

	return varToFilePath
}
