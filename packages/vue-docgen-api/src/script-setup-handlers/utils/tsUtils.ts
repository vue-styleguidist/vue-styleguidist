import fs from 'fs'
import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import { TSExpressionWithTypeArgumentsKind, TSPropertySignatureKind } from 'ast-types/lib/gen/kinds'
import { visit } from 'recast'
import { dirname } from 'path'
import buildParser from '../../babel-parser'
import { ParseOptions } from '../../types'
import makePathResolver from '../../utils/makePathResolver'
import Documentation from '../../Documentation'

export function defineHandler(
	handler: (
		documentation: Documentation,
		componentDefinition: NodePath,
		astPath: bt.File,
		opt: ParseOptions
	) => Promise<void>
) {
	return handler
}

const getTypeDefinitionFromIdentifierFromModule = (
	module: string,
	typeName: string,
	opt: ParseOptions,
	pathResolver: (filePath: string, originalDirNameOverride?: string) => string | null
) => {
	const parser = buildParser({ plugins: ['typescript'] })
	const filePath = pathResolver(module)

	if (!filePath || !opt.validExtends(filePath)) {
		return undefined
	}

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
	opt: ParseOptions,
	importName?: string
): NodePath | undefined {
	let typeBody: NodePath | undefined = undefined
	const pathResolver = makePathResolver(dirname(opt.filePath), opt.alias, opt.modules)

	visit(astPath.program, {
		visitExportAllDeclaration(nodePath) {
			typeBody =
				typeBody ??
				getTypeDefinitionFromIdentifierFromModule(
					nodePath.value.source.value,
					typeName,
					opt,
					pathResolver
				)

			return false
		},
		visitExportSpecifier(nodePath) {
			if (!typeBody && nodePath.value.exported.name === typeName) {
				typeBody = getTypeDefinitionFromIdentifierFromModule(
					nodePath.parent.value.source.value,
					nodePath.value.local.name,
					opt,
					pathResolver
				)
			}

			return false
		},
		visitImportSpecifier(nodePath) {
			if (!typeBody && nodePath.value.imported.name === typeName) {
				typeBody = getTypeDefinitionFromIdentifierFromModule(
					nodePath.parent.value.source.value,
					typeName,
					opt,
					pathResolver
				)
			}

			return false
		},
		visitImportNamespaceSpecifier(path) {
			if (!typeBody && path.value.local.name === importName) {
				typeBody = getTypeDefinitionFromIdentifierFromModule(
					path.parent.value.source.value,
					typeName,
					opt,
					pathResolver
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
				const typeAnnotation = nodePath.get('typeAnnotation')
				if (bt.isTSTypeLiteral(typeAnnotation.node)) {
					typeBody = typeAnnotation.get('members')
				} else if (bt.isTSTypeReference(typeAnnotation.node)) {
					typeBody = getTypeDefinitionFromIdentifier(
						astPath,
						typeAnnotation.node.typeName.name,
						opt
					)
				}
			}
			return false
		}
	})
	return typeBody
}

export default {}
