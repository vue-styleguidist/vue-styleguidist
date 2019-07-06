import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import * as path from 'path'
import Map from 'ts-map'
import { Documentation } from '../Documentation'
import { parseFile, ParseOptions } from '../parse'
import resolveImmediatelyExportedRequire from '../utils/adaptExportsToIEV'
import makePathResolver from '../utils/makePathResolver'
import resolveRequired from '../utils/resolveRequired'

/**
 * @returns {object} an object containing the documentations for each mixin
 * key: mixin variable name
 * value: documentation of named mixin
 */
export default function mixinsHandler(
	documentation: Documentation,
	componentDefinition: NodePath,
	astPath: bt.File,
	opt: ParseOptions
) {
	const originalDirName = path.dirname(opt.filePath)

	const pathResolver = makePathResolver(originalDirName, opt.alias)

	// filter only mixins
	const mixinVariableNames = getMixinsVariableNames(componentDefinition)

	if (!mixinVariableNames) {
		return
	}

	// get all require / import statements
	const mixinVarToFilePath = resolveRequired(astPath, mixinVariableNames)

	resolveImmediatelyExportedRequire(pathResolver, mixinVarToFilePath)

	// get each doc for each mixin using parse
	const files = new Map<string, string[]>()
	for (const varName of Object.keys(mixinVarToFilePath)) {
		const { filePath, exportName } = mixinVarToFilePath[varName]
		const fullFilePath = pathResolver(filePath)
		if (!/[\\/]node_modules[\\/]/.test(fullFilePath)) {
			const vars = files.get(fullFilePath) || []
			vars.push(exportName)
			files.set(fullFilePath, vars)
		}
	}

	files.forEach((vars, fullFilePath) => {
		if (fullFilePath && vars) {
			try {
				parseFile(documentation, { ...opt, filePath: fullFilePath, nameFilter: vars })
			} catch (e) {
				// eat the error
			}
		}
	})
	documentation.set('displayName', null)
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
