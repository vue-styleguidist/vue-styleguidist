import Map from 'ts-map'
import { ImportedVariableSet } from './resolveRequired'
import { parseFile, ParseOptions } from '../parse'
import Documentation from '../Documentation'

export default async function documentRequiredComponents(
	documentation: Documentation | undefined,
	varToFilePath: ImportedVariableSet,
	pathResolver: (filePath: string, originalDirNameOverride?: string) => string,
	originObject: 'extends' | 'mixin' | undefined,
	opt: ParseOptions
): Promise<Documentation[]> {
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
				// eat the error
			}
		}
	}, Promise.resolve())
	return docs
}
