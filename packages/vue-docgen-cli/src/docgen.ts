import * as path from 'path'
import { SafeDocgenCLIConfig, Templates, RenderedUsage } from './config'
import singleMd, { DocgenCLIConfigWithOutFile } from './singleMd'
import multiMd from './multiMd'
import extractConfig from './extractConfig'
import getSources from './getSources'

export { SafeDocgenCLIConfig as DocgenCLIConfig, Templates, RenderedUsage, extractConfig }

export interface DocgenCLIConfigWithComponents extends SafeDocgenCLIConfig {
	components: string | string[]
}

function hasComponents(config: SafeDocgenCLIConfig): config is DocgenCLIConfigWithComponents {
	return !!config.components
}

export default async (config: SafeDocgenCLIConfig) => {
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

	// then create the watcher if necessary
	const { watcher, componentFiles, docMap } = await getSources(
		config.components,
		config.componentsRoot,
		config.getDocFileName,
		config.apiOptions
	)

	if (config.outFile) {
		// create one combined documentation file
		await singleMd(componentFiles, watcher, config as DocgenCLIConfigWithOutFile, docMap)
	} else {
		// create one documentation file per component
		await multiMd(componentFiles, watcher, config, docMap)
	}

	if (!config.watch) {
		watcher.close()
	}
}
