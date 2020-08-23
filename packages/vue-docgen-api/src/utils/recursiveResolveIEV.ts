import { readFile } from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import { parse } from 'recast'
import Map from 'ts-map'
import buildParser from '../babel-parser'
import cacher from './cacher'
import resolveImmediatelyExported from './resolveImmediatelyExported'
import { ImportedVariableSet } from './resolveRequired'

const read = promisify(readFile)

// eslint-disable-next-line @typescript-eslint/no-var-requires
const hash = require('hash-sum')

/**
 * Recursively resolves specified variables to their actual files
 * Useful when using intermeriary files like this
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
	// resolve imediately exported variable as many layers as they are burried
	let hashBefore: any
	do {
		hashBefore = hash(varToFilePath)
		// in this case I need to resolve IEV in sequence in case they are defined multiple times
		// eslint-disable-next-line no-await-in-loop
		await resolveIEV(pathResolver, varToFilePath, validExtends)
	} while (hashBefore !== hash(varToFilePath))
}

/**
 * Resolves specified variables to their actual files
 * Useful when using intermeriary files like this
 *
 * ```js
 * export mixin from "path/to/mixin"
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
		const exportedVariable = varToFilePath[k]
		exportedVariable.filePath.forEach(filePath => {
			const exportToLocalMap = filePathToVars.get(filePath) || new Map<string, string>()
			exportToLocalMap.set(k, exportedVariable.exportName)
			filePathToVars.set(filePath, exportToLocalMap)
		})
	})

	// then roll though this map and replace varToFilePath elements with their final destinations
	// {
	//	nameOfVariable:{filePath:['filesWhereToFindIt'], exportedName:'nameUsedInExportThatCanBeUsedForFiltering'}
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
						return
					}
					const source = await read(fullFilePath, {
						encoding: 'utf-8'
					})
					const astRemote = cacher(() => parse(source, { parser: buildParser() }), source)
					const returnedVariables = resolveImmediatelyExported(astRemote, exportedVariableNames)
					if (Object.keys(returnedVariables).length) {
						exportToLocal.forEach((exported, local) => {
							if (exported && local) {
								const aliasedVariable = returnedVariables[exported]
								if (aliasedVariable) {
									aliasedVariable.filePath = aliasedVariable.filePath
										.map(p => pathResolver(p, path.dirname(fullFilePath)))
										.filter(a => a) as string[]
									varToFilePath[local] = aliasedVariable
								}
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
