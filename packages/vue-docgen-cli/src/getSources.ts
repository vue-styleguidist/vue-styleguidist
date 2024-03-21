import * as path from 'path'
import glob from 'globby'
import chokidar, { FSWatcher } from 'chokidar'
import { parseMulti, ParamTag, ScriptHandlers, DocGenOptions } from 'vue-docgen-api'
import { getDocMap, resolveRequiresFromTag } from './utils'
import { PropsParser } from './config'

/**
 *
 * @param components glob or globs to watch
 * @param cwd option to pass chokidar
 * @param getDocFileName a function to go from component to doc file
 */
export default async function getSources(
	components: string | string[],
	ignore: string[],
	cwd: string,
	getDocFileName: (componentPath: string) => string | string[] | false,
	propsParser: typeof parseMulti,
	optionsApi: DocGenOptions = {}
): Promise<{
	watcher: FSWatcher
	docMap: { [filepath: string]: string }
	componentFiles: string[]
}> {
	const watcher = chokidar.watch(components, { cwd, ignored: ignore })

	const allComponentFiles = await glob(components, { cwd, ignore })

	// we will parse each of the discovered components looking for @requires
	// and @example/examples to add them to the watcher.
	const requiredComponents = (
		await Promise.all(
			allComponentFiles.map(compPath =>
				getRequiredComponents(compPath, optionsApi, propsParser, cwd)
			)
		)
	).reduce((acc, comps) => acc.concat(comps), [])

	const componentFiles = allComponentFiles.filter(
		compPath => !requiredComponents.includes(compPath)
	)

	const docMap = getDocMap(
		// if a component is required, it cannot be the direct target of a ReadMe doc
		// if we let it be this target it could override a legitimate target.
		componentFiles,
		getDocFileName,
		cwd
	)
	watcher.add(Object.keys(docMap))

	return { watcher, docMap, componentFiles }
}

async function getRequiredComponents(
	compPath: string,
	optionsApi: DocGenOptions,
	propsParser: PropsParser,
	cwd: string
): Promise<string[]> {
	const compDirName = path.dirname(compPath)
	const absoluteComponentPath = path.join(cwd, compPath)
	try {
		const docs = await propsParser(
			absoluteComponentPath,
			{
				// make sure that this is recognized as an option bag
				jsx: false,
				...optionsApi,
				scriptHandlers: [ScriptHandlers.componentHandler]
			},
			'init'
		)
		const requires = docs.reduce(
			(acc, { tags }) => (tags?.requires ? acc.concat(tags.requires) : acc),
			[] as ParamTag[]
		)
		if (requires.length) {
			return resolveRequiresFromTag(requires, compDirName)
		}
	} catch (e) {
		const err = e as Error
		throw new Error(`Error parsing ${absoluteComponentPath} for @requires tags: ${err.message}`)
	}
	return []
}
