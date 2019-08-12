import * as path from 'path'
import * as fs from 'fs'
import { promisify } from 'util'
import chokidar from 'chokidar'
import mkdirpNative from 'mkdirp'
import prettier from 'prettier'
import compileTemplates, { DocgenCLIConfig } from './compileTemplates'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const mkdirp = promisify(mkdirpNative)

/**
 * Prettify then save a markdown content
 * If the needed directory does not exist, create it
 * @param content dirty looking markdown content to be saved
 * @param destFilePath destination absolute file path
 */
export async function writeDownMdFile(content: string, destFilePath: string) {
	const prettyMd = prettier.format(content, { parser: 'markdown' })
	const destFolder = path.dirname(destFilePath)
	await mkdirp(destFolder)
	await writeFile(destFilePath, prettyMd)
}

/**
 * From one component, get a markdown documentation and return it as string
 * @param config configuration
 * @param file relative path of the parsed component
 */
export async function compileMarkdown(config: DocgenCLIConfig, file: string): Promise<string> {
	const componentAbsolutePath = path.join(config.componentsRoot, file)
	const docFilePath = config.getDocFileName(componentAbsolutePath)
	var extraContent: string | undefined = undefined
	try {
		extraContent = await readFile(docFilePath, 'utf8')
	} catch (e) {
		// eat error if file not found
	}
	return compileTemplates(componentAbsolutePath, config, file, extraContent)
}

/**
 * returns a chokidar watcher watching not only the files in
 * the glob but their corresponding doc files
 * @param components
 * @param componentsRoot
 * @param files
 * @param getDocFileName
 */
export function getWatcher(
	components: string | string[],
	componentsRoot: string,
	files: string[],
	getDocFileName: (file: string) => string
) {
	const watcher = chokidar.watch(components, { cwd: componentsRoot })
	files.forEach(f => {
		const docfile = getDocFileName(f)
		watcher.add(docfile)
	})
	return watcher
}

export function getDocMap(
	files: string[],
	getDocFileName: (file: string) => string,
	root: string
): { [filepath: string]: string } {
	const docMap: { [filepath: string]: string } = {}
	files.forEach(f => {
		const docFilePath = getDocFileName(f)
		docMap[path.relative(root, docFilePath)] = f
	})
	return docMap
}
