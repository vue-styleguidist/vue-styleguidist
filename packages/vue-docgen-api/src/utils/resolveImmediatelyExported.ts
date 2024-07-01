import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import { visit } from 'recast'
import { ImportedVariableSet } from './resolveRequired'

export default function (ast: bt.File, variableFilter: string[]) {
	const variables: ImportedVariableSet = {}

	const importedVariablePaths: ImportedVariableSet = {}

	const exportAllFiles: string[] = []

	// get imported variable names and filepath
	visit(ast.program, {
		visitImportDeclaration(astPath) {
			if (!astPath.node.source) {
				return false
			}
			const filePath = astPath.node.source.value
			if (typeof filePath !== 'string') {
				return false
			}

			const specifiers = astPath.get('specifiers')
			specifiers.each((s: NodePath<bt.ImportSpecifier | bt.ImportDefaultSpecifier>) => {
				const varName = s.node.local.name
				const exportName =
					bt.isImportSpecifier(s.node) && bt.isIdentifier(s.node.imported)
						? s.node.imported.name
						: 'default'
				importedVariablePaths[varName] = { filePath: [filePath], exportName }
			})
			return false
		}
	})

	visit(ast.program, {
		visitExportNamedDeclaration(astPath) {
			const specifiers = astPath.get('specifiers')
			if (astPath.node.source) {
				const filePath = astPath.node.source.value
				if (typeof filePath !== 'string') {
					return false
				}

				specifiers.each((s: NodePath<bt.ExportSpecifier>) => {
					if (bt.isIdentifier(s.node.exported)) {
						const varName = s.node.exported.name
						const exportName = s.node.local ? s.node.local.name : varName
						if (variableFilter.indexOf(varName) > -1) {
							variables[varName] = { filePath: [filePath], exportName }
						}
					}
				})
			} else {
				specifiers.each((s: NodePath<bt.ExportSpecifier>) => {
					if (bt.isIdentifier(s.node.exported)) {
						const varName = s.node.exported.name
						const middleName = s.node.local.name
						const importedVar = importedVariablePaths[middleName]
						if (importedVar && variableFilter.indexOf(varName) > -1) {
							variables[varName] = importedVar
						}
					}
				})
			}

			return false
		},
		visitExportDefaultDeclaration(astPath) {
			if (variableFilter.indexOf('default') > -1) {
				const middleNameDeclaration = astPath.node.declaration
				if (middleNameDeclaration.type === 'Identifier') {
					const middleName = middleNameDeclaration.name
					const importedVar = importedVariablePaths[middleName]
					if (importedVar) {
						variables.default = importedVar
					}
				}
			}
			return false
		},
		visitExportAllDeclaration(astPath) {
			const newFilePath = astPath.get('source').node.value
			exportAllFiles.push(newFilePath)
			return false
		}
	})

	if (exportAllFiles.length) {
		variableFilter
			.filter(v => !variables[v])
			.forEach(exportName => {
				variables[exportName] = { filePath: exportAllFiles, exportName }
			})
	}

	return { variables, exportAll: exportAllFiles.length > 0 }
}
