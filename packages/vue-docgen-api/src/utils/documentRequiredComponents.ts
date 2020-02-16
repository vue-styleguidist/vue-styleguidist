import Map from 'ts-map'
import * as path from 'path'
import { ImportedVariableSet } from './resolveRequired'
import recursiveResolveIEV from '../utils/recursiveResolveIEV'
import { parseFile, ParseOptions } from '../parse'
import Documentation from '../Documentation'
import makePathResolver from './makePathResolver'

/**
 * Document all components in varToFilePath in documentation
 * Instead of giving it only one component file, here we give it a whole set of variable -> file
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
	const pathResolver = makePathResolver(originalDirName, opt.alias, opt.modules)

	// resolve where components are through immediately exported variables
	await recursiveResolveIEV(pathResolver, varToFilePath, opt.validExtends)

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
			// if we are in a mixin or an extend we want to apply
			// all props on the current doc, instad of creating anther one
			if (originObject && documentation) {
				try {
					const originVar = {
						[originObject]: {
							name: '-',
							path: path.relative(path.dirname(documentation.componentFullfilePath), fullFilePath)
						}
					}
					await vars.reduce(async (_, v) => {
						await _
						await parseFile(
							{
								...opt,
								filePath: fullFilePath,
								nameFilter: [v],
								...originVar
							},
							documentation
						)
					}, Promise.resolve())
					if (documentation && originVar[originObject]) {
						originVar[originObject].name =
							documentation.get('displayName') || documentation.get('exportName')
						documentation.set('displayName', null)
					}
				} catch (e) {
					// eat the error
				}
			} else {
				docs = docs.concat(
					await parseFile(
						{
							...opt,
							filePath: fullFilePath,
							nameFilter: vars
						},
						documentation
					)
				)
			}
		}
	}, Promise.resolve())
	return docs
}
