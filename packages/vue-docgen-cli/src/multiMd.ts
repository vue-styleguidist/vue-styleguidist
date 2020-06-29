import * as fs from 'fs'
import * as path from 'path'
import { FSWatcher } from 'chokidar'
import { promisify } from 'util'
import { writeDownMdFile } from './utils'
import { DocgenCLIConfigWithComponents } from './docgen'
import compileTemplates from './compileTemplates'

const unlink = promisify(fs.unlink)

/**
 * Build one md file per given compnent and save it respecting original scaffolding
 * if `config.watch` is true will jkeep on watch file changes
 * and update all needed files
 * @param files
 * @param config
 */
export default async function (
	files: string[],
	watcher: FSWatcher,
	config: DocgenCLIConfigWithComponents,
	docMap: { [filepath: string]: string },
	_compile = compile
) {
	const compileWithConfig = _compile.bind(null, config, docMap, watcher)

	await Promise.all(files.map(f => compileWithConfig(f)))

	if (config.watch) {
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
 * Compile a markdown file from a components and save it
 * This will use the filePath to know where to save
 * @param config config passed to the current chunk
 * @param docMap a map of each documentation file to the component they refer to
 * @param watcher
 * @param filePath relative path where the MD file is going to be saved
 */
export async function compile(
	config: DocgenCLIConfigWithComponents,
	docMap: { [filepath: string]: string },
	watcher: FSWatcher,
	filePath: string
) {
	const componentFile = docMap[filePath] || filePath
	const file = config.getDestFile(componentFile, config)

	// if getDestFile is null, will not create files
	if (file) {
		const { content, dependencies } = await compileTemplates(
			path.join(config.componentsRoot, componentFile),
			config,
			componentFile
		)
		dependencies.forEach(d => {
			watcher.add(d)
			docMap[d] = componentFile
		})
		writeDownMdFile(content, file)
	}
}
