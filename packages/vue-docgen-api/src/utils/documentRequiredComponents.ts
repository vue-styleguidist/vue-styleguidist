import Map from 'ts-map'
import * as path from 'path'
import { ImportedVariableSet } from './resolveRequired'
import resolveImmediatelyExportedRequire from '../utils/adaptExportsToIEV'
import { parseFile, ParseOptions } from '../parse'
import Documentation from '../Documentation'
import makePathResolver from './makePathResolver'

/**
 * Document all components in varToFilePath in documentation
 *
 * @param documentation if omitted (undefined), it will return all docs in an array
 * @param varToFilePath variable of object to document
 * @param originObject to build the origin flag
 * @param opt parsing options
 */
export default async function documentRequiredComponents(
	documentation: Documentation | undefined,
	varToFilePath: ImportedVariableSet,
	originObject: 'extends' | 'mixin' | undefined,
	opt: ParseOptions
): Promise<Documentation[]> {
	const originalDirName = path.dirname(opt.filePath)
	const pathResolver = makePathResolver(originalDirName, opt.alias)

	// resolve their documentations
	await resolveImmediatelyExportedRequire(pathResolver, varToFilePath, opt.validExtends)

	const files = new Map<string, string[]>()
	for (const varName of Object.keys(varToFilePath)) {
		const { filePath, exportName } = varToFilePath[varName]
		filePath.forEach(p => {
			const fullFilePath = pathResolver(p)
			if (opt.validExtends(fullFilePath)) {
				const vars = files.get(fullFilePath) || []
				vars.push(exportName)
				files.set(fullFilePath, vars)
			}
		})
	}

	let docs: Documentation[] = []
	await files.keys().reduce(async (_, fullFilePath) => {
		await _
		const vars = files.get(fullFilePath)
		if (fullFilePath && vars) {
			try {
				const originVar = originObject
					? {
							[originObject]: {
								name: '-',
								path: fullFilePath
							}
					  }
					: {}

				docs = [
					...docs,
					...(await parseFile(
						{
							...opt,
							filePath: fullFilePath,
							nameFilter: vars,
							...originVar
						},
						documentation
					))
				]

				if (documentation && originObject && originVar[originObject]) {
					originVar[originObject].name = documentation.get('displayName')
					documentation.set('displayName', null)
				}
			} catch (e) {
				if (originObject) {
					// eat the error
				} else {
					// we still want non extensions errors to show
					throw e
				}
			}
		}
	}, Promise.resolve())
	return docs
}
