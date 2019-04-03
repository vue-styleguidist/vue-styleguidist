import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import * as path from 'path'
import { Documentation } from '../Documentation'
import { parseFile, ParseOptions } from '../parse'
import resolveImmediatelyExportedRequire from '../utils/adaptExportsToIEV'
import makePathResolver from '../utils/makePathResolver'
import resolveRequired from '../utils/resolveRequired'

/**
 * Returns documentation of the component referenced in the extends property of the component
 * @param {NodePath} astPath
 * @param {Array<NodePath>} componentDefinitions
 * @param {string} originalFilePath
 */
export default function extendsHandler(
	documentation: Documentation,
	componentDefinition: NodePath,
	astPath: bt.File,
	opt: ParseOptions
) {
	const extendsVariableName = getExtendsVariableName(componentDefinition)

	// if there is no extends or extends is a direct require
	if (!extendsVariableName) {
		return
	}

	// get all require / import statements
	const extendsFilePath = resolveRequired(astPath, [extendsVariableName])

	const originalDirName = path.dirname(opt.filePath)

	const pathResolver = makePathResolver(originalDirName, opt.alias)

	resolveImmediatelyExportedRequire(pathResolver, extendsFilePath)

	// only look for documentation in the current project not in node_modules
	if (/^\./.test(extendsFilePath[extendsVariableName].filePath)) {
		const fullFilePath = pathResolver(extendsFilePath[extendsVariableName].filePath)

		parseFile(documentation, {
			...opt,
			filePath: fullFilePath,
			nameFilter: [extendsFilePath[extendsVariableName].exportName]
		})
		// make sure that the parent name does not bleed on the new doc
		documentation.set('displayName', null)
	}
}

function getExtendsVariableName(compDef: NodePath): string | undefined {
	const extendsVariable: NodePath | undefined =
		compDef &&
		bt.isClassDeclaration(compDef.node) &&
		compDef.node.superClass &&
		bt.isIdentifier(compDef.node.superClass)
			? (compDef.get('superClass') as NodePath<bt.Identifier>)
			: getExtendsVariableNameFromCompDef(compDef)

	if (extendsVariable) {
		const extendsValue = bt.isProperty(extendsVariable.node)
			? extendsVariable.node.value
			: extendsVariable.node
		return extendsValue && bt.isIdentifier(extendsValue) ? extendsValue.name : undefined
	}
	return undefined
}

function getExtendsVariableNameFromCompDef(compDef: NodePath): NodePath | undefined {
	if (!compDef) {
		return undefined
	}
	const compDefProperties = compDef.get('properties')
	const pathExtends = compDefProperties.value
		? compDefProperties.filter((p: NodePath<bt.Property>) => p.node.key.name === 'extends')
		: []
	return pathExtends.length ? pathExtends[0] : undefined
}
