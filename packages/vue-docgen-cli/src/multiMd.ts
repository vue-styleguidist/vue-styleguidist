import * as fs from 'fs'
import { FSWatcher } from 'chokidar'
import { promisify } from 'util'
import { compileMarkdown, writeDownMdFile } from './utils'
import { DocgenCLIConfigWithComponents } from './docgen'

const unlink = promisify(fs.unlink)

/**
 * Build one md file per given compnent and save it respecting original scaffolding
 * if `config.watch` is true will jkeep on watch file changes
 * and update all needed files
 * @param files
 * @param config
 */
export default function(
	files: string[],
	watcher: FSWatcher | undefined,
	config: DocgenCLIConfigWithComponents,
	docMap: { [filepath: string]: string },
	_compile = compile
) {
	const compileWithConfig = _compile.bind(null, config, docMap)

	files.forEach(compileWithConfig)

	if (watcher) {
		watcher
			// on filechange, recompile the corresponding file
			.on('add', compileWithConfig)
			.on('change', compileWithConfig)
			// on file delete, delete corresponding md file
			.on('unlink', (relPath: string) => {
				unlink(config.getDestFile(relPath, config))
			})
	}
}

/**
 * /**
 * Compile a markdown flie from a components and save it
 * This will use the filePath to know where to save
 * @param config config passed to the current chunk
 * @param docMap a map of each documentation file to the component they refer to
 * @param filePath relative path where the MD file is going to be saved
 */
export async function compile(
	config: DocgenCLIConfigWithComponents,
	docMap: { [filepath: string]: string },
	filePath: string
) {
	const componentFile = docMap[filePath] || filePath
	writeDownMdFile(
		await compileMarkdown(config, componentFile),
		config.getDestFile(componentFile, config)
	)
}
