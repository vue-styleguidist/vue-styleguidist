import { promises as fs } from 'fs'
import * as path from 'path'
import { parse } from 'recast'
import Map from 'ts-map'
import hash from 'hash-sum'
import buildParser from '../babel-parser'
import cacher from './cacher'
import resolveImmediatelyExported from './resolveImmediatelyExported'
import { ImportedVariableSet } from './resolveRequired'

/**
 * Recursively resolves specified variables to their actual files
 * Useful when using intermediary files like this
 *
 * ```js
 * export mixin from "path/to/mixin"
 * ```
 *
 * @param pathResolver function to resolve relative to absolute path
 * @param varToFilePath set of variables to be resolved (will be mutated into the final mapping)
 */
export default async function recursiveResolveIEV(
	pathResolver: (path: string, originalDirNameOverride?: string) => string | null,
	varToFilePath: ImportedVariableSet,
	validExtends: (fullFilePath: string) => boolean
) {
	// resolve immediately exported variable as many layers as they are buried
	const hashes = new Set<string>()

	do {
		// in this case I need to resolve IEV in sequence in case they are defined multiple times
		// eslint-disable-next-line no-await-in-loop
		await resolveIEV(pathResolver, varToFilePath, validExtends)
		// we iterate until there is no change in the set of variables or there is a loop
	} while (!hashes.has(hash(varToFilePath)) && hashes.add(hash(varToFilePath)))
}

/**
 * Resolves specified variables to their actual files
 * Useful when using intermediary files like this
 *
 * ```js
 * export mixin from "path/to/mixin"
 * export * from "path/to/another/mixin"
 * ```
 *
 * @param pathResolver function to resolve relative to absolute path
 * @param varToFilePath set of variables to be resolved (will be mutated into the final mapping)
 */
export async function resolveIEV(
	pathResolver: (path: string, originalDirNameOverride?: string) => string | null,
	varToFilePath: ImportedVariableSet,
	validExtends: (fullFilePath: string) => boolean
) {
	// First, create a map from filepath to localName and exportedName
	// key: filepath, content: {key: localName, content: exportedName}
	const filePathToVars = new Map<string, Map<string, string>>()
	Object.keys(varToFilePath).forEach(k => {
		// the only way a variable can be exported by multiple files
		// is if one of those files is exported as follows
		// export * from 'path/to/file'
		const exportedVariable = varToFilePath[k]
		exportedVariable.filePath.forEach((filePath, i) => {
			const exportToLocalMap = filePathToVars.get(filePath) || new Map<string, string>()
			exportToLocalMap.set(k, exportedVariable.exportName)
			filePathToVars.set(filePath, exportToLocalMap)
		})
	})

	// then roll though this map and replace varToFilePath elements with their final destinations
	// {
	//	nameOfVariable: { filePath:['filesWhereToFindIt'], exportedName:'nameUsedInExportThatCanBeUsedForFiltering' }
	// }
	await Promise.all(
		filePathToVars.entries().map(async ([filePath, exportToLocal]) => {
			if (filePath && exportToLocal) {
				const exportedVariableNames: string[] = []
				exportToLocal.forEach(exportedName => {
					if (exportedName) {
						exportedVariableNames.push(exportedName)
					}
				})
				try {
					const fullFilePath = pathResolver(filePath)
					if (!fullFilePath || !validExtends(fullFilePath)) {
						// if the file is not in scope of the analysis, skip it
						// if no variable export corresponds to this local name, we delete it at the very end
						return
					}
					const source = await fs.readFile(fullFilePath, {
						encoding: 'utf-8'
					})
					const astRemote = cacher(() => parse(source, { parser: buildParser() }), source)
					const { variables: returnedVariables } = resolveImmediatelyExported(
						astRemote,
						exportedVariableNames
					)
					if (Object.keys(returnedVariables).length) {
						exportToLocal.forEach((exported: string, local: string) => {
							const aliasedVariable = returnedVariables[exported]
							if (aliasedVariable) {
								aliasedVariable.filePath = aliasedVariable.filePath
									.map(p => pathResolver(p, path.dirname(fullFilePath)))
									.filter(a => a) as string[]
								varToFilePath[local] = aliasedVariable
							}
						})
					}
				} catch (e) {
					// ignore load errors
				}
			}
		})
	)
}
