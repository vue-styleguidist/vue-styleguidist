import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import Documentation from '../Documentation'
import type { ParseOptions } from '../types'
import resolveRequired from '../utils/resolveRequired'
import documentRequiredComponents from '../utils/documentRequiredComponents'
import resolveLocal from '../utils/resolveLocal'
import { addDefaultAndExecuteHandlers } from '../utils/execute-handlers'

/**
 * Returns documentation of the component referenced in the extends property of the component
 * @param {NodePath} astPath
 * @param {Array<NodePath>} componentDefinitions
 * @param {string} originalFilePath
 */
export default async function extendsHandler(
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

	const variablesResolvedToCurrentFile = resolveLocal(astPath, [extendsVariableName])

	if (variablesResolvedToCurrentFile.get(extendsVariableName)) {
		await addDefaultAndExecuteHandlers(
			variablesResolvedToCurrentFile,
			astPath,
			{
				...opt,
				nameFilter: [extendsVariableName]
			},
			documentation
		)
	} else {
		// get all require / import statements
		const extendsFilePath = resolveRequired(astPath, [extendsVariableName])

		// get each doc for each mixin using parse
		await documentRequiredComponents(documentation, extendsFilePath, 'extends', opt)
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
		? compDefProperties.filter(
				(p: NodePath<bt.Property>) => bt.isIdentifier(p.node.key) && p.node.key.name === 'extends'
		  )
		: []
	return pathExtends.length ? pathExtends[0] : undefined
}
