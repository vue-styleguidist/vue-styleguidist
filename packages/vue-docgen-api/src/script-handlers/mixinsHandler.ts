import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import Documentation from '../Documentation'
import { ParseOptions } from '../parse'
import resolveRequired from '../utils/resolveRequired'
import documentRequiredComponents from '../utils/documentRequiredComponents'
import getProperties from './utils/getProperties'

/**
 * Look in the mixin section of a component.
 * Parse the file mixins point to.
 * Add the necessary info to the current doc object.
 * Must be run first as mixins do not override components.
 * @param documentation
 * @param componentDefinition
 * @param astPath
 * @param opt
 */
export default async function mixinsHandler(
	documentation: Documentation,
	componentDefinition: NodePath,
	astPath: bt.File,
	opt: ParseOptions
) {
	// filter only mixins
	const mixinVariableNames = getMixinsVariableNames(componentDefinition)

	if (!mixinVariableNames || !mixinVariableNames.length) {
		return
	}

	// get require / import statements for mixins
	const mixinVarToFilePath = resolveRequired(astPath, mixinVariableNames)

	// get each doc for each mixin using parse
	await documentRequiredComponents(documentation, mixinVarToFilePath, 'mixin', opt)
}

function getMixinsVariableNames(compDef: NodePath): string[] {
	const varNames: string[] = []
	if (bt.isObjectExpression(compDef.node)) {
		const mixinProp = getProperties(compDef, 'mixins')

		const mixinPath = mixinProp.length ? (mixinProp[0] as NodePath<bt.Property>) : undefined

		if (mixinPath) {
			const mixinPropertyValue =
				mixinPath.node.value && bt.isArrayExpression(mixinPath.node.value)
					? mixinPath.node.value.elements
					: []
			mixinPropertyValue.forEach((e: bt.Node | null) => {
				if (!e) return
				if (bt.isCallExpression(e)) {
					e = e.callee
				}
				if (bt.isIdentifier(e)) {
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
