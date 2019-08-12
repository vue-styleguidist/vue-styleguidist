import { FSWatcher } from 'chokidar'
import { compileMarkdown, writeDownMdFile } from './utils'
import { DocgenCLIConfigWithComponents } from './docgen'

export interface DocgenCLIConfigWithOutFile extends DocgenCLIConfigWithComponents {
	outFile: string
}

/**
 * Build one md file combining all documentations for components in files
 * if `config.watch` is true will keep on watch file changes
 * and update the current file if needed
 * @param files
 * @param watcher
 * @param config
 * @param _compile
 */
export default function(
	files: string[],
	watcher: FSWatcher | undefined,
	config: DocgenCLIConfigWithOutFile,
	docMap: { [filepath: string]: string },
	_compile = compile
) {
	// This fileCache contains will, because it is
	// bound, the same along usage of this function.
	// it will contain
	// `key`: filePath of source component
	// `content`: markdown compiled for it
	const fileCache = {}
	const compileSingleDocWithConfig = _compile.bind(null, config, files, fileCache, docMap)

	compileSingleDocWithConfig()
	if (watcher) {
		watcher.on('add', compileSingleDocWithConfig).on('change', compileSingleDocWithConfig)
	}
}

/**
 * Compile all components in `files` into one single
 * markdown file and save it to the `config.outFile`
 * @param files the component files relative paths
 * @param config config passed to the current chunk
 * @param cachedContent in order to avoid reparsing unchanged components pass an object wher to store for future reference
 * @param docMap a map of each documentation file to the component they refer to
 * @param changedFilePath When in wtch mode, provide the relative path of the file that changes to only re-parse this file
 */
export async function compile(
	config: DocgenCLIConfigWithOutFile,
	files: string[],
	cachedContent: { [filepath: string]: string },
	docMap: { [filepath: string]: string },
	changedFilePath?: string
) {
	// this local function will enrich the cachedContent with the
	// current components documentation
	const cacheMarkDownContent = async (filePath: string) => {
		cachedContent[filePath] = await compileMarkdown(config, filePath)
		return true
	}

	if (changedFilePath) {
		// resolve the real component file path before updating if needed
		changedFilePath = docMap[changedFilePath] || changedFilePath

		// if in chokidar mode (watch), the path of the file that was just changed
		// is passed as an argument. We only affect the changed file and avoid re-parsing the rest
		await cacheMarkDownContent(changedFilePath)
	} else {
		// if we are initializing the current file, parse all components
		await Promise.all(files.map(cacheMarkDownContent))
	}
	// and finally save all concatenated values to the markdown file
	writeDownMdFile(Object.values(cachedContent).join(''), config.outFile)
}
