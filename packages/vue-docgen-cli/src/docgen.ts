import * as path from 'path'
import globby from 'globby'
import { FSWatcher } from 'chokidar'
import { DocgenCLIConfig } from './extractConfig'
import singleMd, { DocgenCLIConfigWithOutFile } from './singleMd'
import multiMd from './multiMd'
import { getWatcher, getDocMap } from './utils'

export interface DocgenCLIConfigWithComponents extends DocgenCLIConfig {
	components: string | string[]
}

function hasComponents(config: DocgenCLIConfig): config is DocgenCLIConfigWithComponents {
	return !!config.components
}

export default async (config: DocgenCLIConfig) => {
	// if at a level that has no components (top level) just give up
	if (!hasComponents(config)) return

	// if componentsRoot is not specified we start with current cwd
	config.componentsRoot = path.resolve(config.cwd, config.componentsRoot)
	// outdir can be specified as relative to cwd so absolutize it
	config.outDir = path.resolve(config.cwd, config.outDir)
	// outfile needs to be absolutized too. relative the outDir will allow us to
	// specify the root dir of docs no top of pages and build the path as we go
	// avoiding to repeat the start path
	config.outFile = config.outFile ? path.resolve(config.outDir, config.outFile) : undefined

	// for every component file in the glob,
	const files = await globby(config.components, { cwd: config.componentsRoot })

	// then create the watcher if necessary
	var watcher: FSWatcher | undefined
	if (config.watch) {
		watcher = getWatcher(
			config.components,
			config.componentsRoot,
			files.map(f => path.relative(config.componentsRoot, config.getDocFileName(f)))
		)
	}

	const docMap = getDocMap(files, config.getDocFileName, config.componentsRoot)

	if (config.outFile) {
		// create one combined documentation file
		singleMd(files, watcher, config as DocgenCLIConfigWithOutFile, docMap)
	} else {
		// create one documentation file per component
		multiMd(files, watcher, config, docMap)
	}
}
