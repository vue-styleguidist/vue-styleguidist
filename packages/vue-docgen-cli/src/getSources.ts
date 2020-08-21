import * as path from 'path'
import glob from 'globby'
import chokidar, { FSWatcher } from 'chokidar'
import { parse, ParamTag, ScriptHandlers, DocGenOptions } from 'vue-docgen-api'
import { getDocMap } from './utils'

/**
 *
 * @param components glob or globs to watch
 * @param cwd option to pass chokidar
 * @param getDocFileName a function to go from component to doc file
 */
export default async function getSources(
	components: string | string[],
	cwd: string,
	getDocFileName: (componentPath: string) => string | false,
	optionsApi: DocGenOptions = {}
): Promise<{
	watcher: FSWatcher
	docMap: { [filepath: string]: string }
	componentFiles: string[]
}> {
	const watcher = chokidar.watch(components, { cwd })

	const allComponentFiles = await glob(components, { cwd })

	// we will parse each of the discovered components looking for @requires
	// and @example/examples to add them to the watcher.
	const requiredComponents = (
		await Promise.all(
			allComponentFiles.map(compPath => getRequiredComponents(compPath, optionsApi, cwd))
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
	cwd: string
): Promise<string[]> {
	const compDirName = path.dirname(compPath)
	const absoluteComponentPath = path.join(cwd, compPath)
	try {
		const { tags } = await parse(absoluteComponentPath, {
			// make sure that this is recognized as an option bag
			jsx: false,
			...optionsApi,
			scriptHandlers: [ScriptHandlers.componentHandler]
		})
		if (tags?.requires?.length) {
			return tags.requires.map((t: ParamTag) => path.join(compDirName, t.description as string))
		}
	} catch (e) {
		throw new Error(`Error parsing ${absoluteComponentPath} for @requires tags: ${e.message}`)
	}
	return []
}
