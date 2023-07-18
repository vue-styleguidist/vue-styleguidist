import fs from 'fs'
import path from 'path'
import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import { TSExpressionWithTypeArgumentsKind, TSPropertySignatureKind } from 'ast-types/lib/gen/kinds'
import { visit } from 'recast'
import buildParser from '../../babel-parser'
import { ParseOptions } from '../../types'

/**
 * Emulate the module import logic as much as necessary to resolve a module containing the
 * interface or type.
 *
 * @param base Path to the file that is importing the module
 * @param module Relative path to the module
 * @returns The absolute path to the file that contains the module to be imported
 */
const importFilePath = (base: string, module: string) => {
	const importedPath = path.resolve(path.dirname(base), module)
	const exists = fs.existsSync(importedPath)
	const isDir = exists && fs.statSync(importedPath).isDirectory()

	if (exists) {
		if (isDir) {
			return `${importedPath}/index.ts`
		}

		return importedPath
	}

	return `${importedPath}.ts`
}

const getTypeDefinitionFromIdentifierFromModule = (
	module: string,
	typeName: string,
	opt: ParseOptions
) => {
	const parser = buildParser({ plugins: ['typescript'] })
	const filePath = importFilePath(opt.filePath, module)

	return getTypeDefinitionFromIdentifier(
		parser.parse(
			fs.readFileSync(filePath, {
				encoding: 'utf-8'
			})
		),
		typeName,
		{
			...opt,
			filePath
		}
	)
}

export function getTypeDefinitionFromIdentifier(
	astPath: bt.File,
	typeName: string,
	opt: ParseOptions
): NodePath | undefined {
	let typeBody: NodePath | undefined = undefined
	visit(astPath.program, {
		visitExportAllDeclaration(nodePath) {
			typeBody =
				typeBody ??
				getTypeDefinitionFromIdentifierFromModule(nodePath.value.source.value, typeName, opt)

			return false
		},
		visitExportSpecifier(nodePath) {
			if (!typeBody && nodePath.value.exported.name === typeName) {
				typeBody = getTypeDefinitionFromIdentifierFromModule(
					nodePath.parent.value.source.value,
					nodePath.value.local.name,
					opt
				)
			}

			return false
		},
		visitImportSpecifier(nodePath) {
			if (!typeBody && nodePath.value.imported.name === typeName) {
				typeBody = getTypeDefinitionFromIdentifierFromModule(
					nodePath.parent.value.source.value,
					typeName,
					opt
				)
			}

			return false
		},
		visitTSInterfaceDeclaration(nodePath) {
			if (bt.isIdentifier(nodePath.node.id) && nodePath.node.id.name === typeName) {
				const interfaceBody = nodePath.get('body', 'body')

				if (!interfaceBody) {
					return
				}

				// If the interface extends from other interfaces, look these up and insert their properties
				// into the just resolved interface. If the inheriting interface already has such a property
				// defined, to not add it, as the inheriting interface overwrites it.
				if (nodePath.value.extends) {
					const parentInterfaces = nodePath.value.extends as TSExpressionWithTypeArgumentsKind[]
					parentInterfaces.forEach(parentInterface => {
						if (!bt.isIdentifier(parentInterface.expression)) {
							return
						}

						const parentInterfaceBody = getTypeDefinitionFromIdentifier(
							astPath,
							parentInterface.expression.name,
							opt
						)

						parentInterfaceBody?.value.forEach((parentInterfaceProp: TSPropertySignatureKind) => {
							if (
								!interfaceBody.value.find(
									(prop: TSPropertySignatureKind) =>
										bt.isIdentifier(prop.key) &&
										bt.isIdentifier(parentInterfaceProp.key) &&
										prop.key.name === parentInterfaceProp.key.name
								)
							) {
								interfaceBody.value.splice(0, 0, parentInterfaceProp)
							}
						})
					})
				}

				typeBody = interfaceBody
			}
			return false
		},
		visitTSTypeAliasDeclaration(nodePath) {
			if (bt.isIdentifier(nodePath.node.id) && nodePath.node.id.name === typeName) {
				typeBody = nodePath.get('typeAnnotation', 'members')
			}
			return false
		}
	})
	return typeBody
}

export default {}
