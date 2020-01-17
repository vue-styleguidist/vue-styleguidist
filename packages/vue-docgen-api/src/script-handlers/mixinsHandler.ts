import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import * as path from 'path'
import Documentation from '../Documentation'
import { ParseOptions } from '../parse'
import resolveImmediatelyExportedRequire from '../utils/adaptExportsToIEV'
import makePathResolver from '../utils/makePathResolver'
import resolveRequired from '../utils/resolveRequired'
import documentRequiredComponents from '../utils/documentRequiredComponents'

/**
 * @returns {object} an object containing the documentations for each mixin
 * key: mixin variable name
 * value: documentation of named mixin
 */
export default async function mixinsHandler(
	documentation: Documentation,
	componentDefinition: NodePath,
	astPath: bt.File,
	opt: ParseOptions
) {
	const originalDirName = path.dirname(opt.filePath)

	const pathResolver = makePathResolver(originalDirName, opt.alias)

	// filter only mixins
	const mixinVariableNames = getMixinsVariableNames(componentDefinition)

	if (!mixinVariableNames || !mixinVariableNames.length) {
		return
	}

	// get require / import statements for mixins
	const mixinVarToFilePath = resolveRequired(astPath, mixinVariableNames)

	// resolve their documentations
	await resolveImmediatelyExportedRequire(pathResolver, mixinVarToFilePath, opt.validExtends)

	// get each doc for each mixin using parse
	await documentRequiredComponents(documentation, mixinVarToFilePath, pathResolver, 'mixin', opt)
}

function getMixinsVariableNames(compDef: NodePath): string[] {
	const varNames: string[] = []
	if (bt.isObjectExpression(compDef.node)) {
		const mixinProp = compDef
			.get('properties')
			.filter((p: NodePath<bt.Property>) => p.node.key.name === 'mixins')
		const mixinPath = mixinProp.length ? (mixinProp[0] as NodePath<bt.Property>) : undefined

		if (mixinPath) {
			const mixinPropertyValue =
				mixinPath.node.value && bt.isArrayExpression(mixinPath.node.value)
					? mixinPath.node.value.elements
					: []
			mixinPropertyValue.forEach((e: bt.Node | null) => {
				if (e && bt.isIdentifier(e)) {
					varNames.push(e.name)
				}
			})
		}
	} else {
		if (
			bt.isClassDeclaration(compDef.node) &&
			compDef.node.superClass &&
			bt.isCallExpression(compDef.node.superClass) &&
			bt.isIdentifier(compDef.node.superClass.callee) &&
			compDef.node.superClass.callee.name === 'mixins'
		) {
			return compDef.node.superClass.arguments.reduce((acc: string[], a) => {
				if (bt.isIdentifier(a)) acc.push(a.name)
				return acc
			}, [])
		}
	}
	return varNames
}
