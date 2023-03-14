import { promises as fs } from 'fs'
import * as path from 'path'
import { FSWatcher } from 'chokidar'
import { writeDownMdFile } from './utils'
import { DocgenCLIConfigWithComponents } from './docgen'
import compileTemplates from './compileTemplates'

/**
 * Build one md file per given compnent and save it respecting original scaffolding
 * if `config.watch` is true will jkeep on watch file changes
 * and update all needed files
 * @param files
 * @param config
 */
export default async function(
	files: string[],
	watcher: FSWatcher,
	config: DocgenCLIConfigWithComponents,
	docMap: { [filepath: string]: string },
	_compile = compile
) {
	const compileWithConfig = _compile.bind(null, config, docMap, watcher)

	await Promise.all(files.map(f => compileWithConfig(f, false)))

	if (config.watch) {
		watcher
			// on filechange, recompile the corresponding file
			.on('add', compileWithConfig)
			.on('change', compileWithConfig)
			// on file delete, delete corresponding md file
			.on('unlink', (relPath: string) => {
				if (files.includes(relPath)) {
					fs.unlink(config.getDestFile(relPath, config))
				} else {
					// if it's not a main file recompile the file connected to it
					compileWithConfig(docMap[relPath])
				}
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
	filePath: string,
	fromWatcher: boolean = true
) {
	if(fromWatcher){
		console.log(`[vue-docgen-cli] File ${filePath} updated`)	
	}
	const componentFile = docMap[filePath] || filePath
	const file = config.getDestFile(componentFile, config)

	// if getDestFile is null, will not create files
	if (file) {
		try {
			const { content, dependencies } = await compileTemplates(
				path.join(config.componentsRoot, componentFile),
				config,
				componentFile
			)
			dependencies.forEach(d => {
				watcher.add(d)
				docMap[d] = componentFile
			})
			await writeDownMdFile(content, file)
			console.log(`[vue-docgen-cli] File ${file} updated.`)
		} catch (e) {
			const err = e as Error
			throw new Error(`[vue-docgen-cli] Error compiling file ${file}: ${err.message}`)
		}
	}
}
