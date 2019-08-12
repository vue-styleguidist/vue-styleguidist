import * as path from 'path'
import * as fs from 'fs'
import { promisify } from 'util'
import chokidar, { FSWatcher } from 'chokidar'
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
 * @param components glob or globs to watch
 * @param cwd cwd to pass to chokidar
 * @param additionalFilesWatched the files found by globby to
 */
export function getWatcher(
	components: string | string[],
	cwd: string,
	additionalFilesWatched: string[]
): FSWatcher {
	const w = chokidar.watch(components, { cwd })
	w.add(additionalFilesWatched)
	return w
}

/**
 * retrun an object matching document relative file path
 * with their corresponding components, it's inteded to be use
 * with watchers to update the right documentation on update of
 * Readme.md files
 * @param files file paths of the matched comeponents
 * @param getDocFileName way to transform a comopnent path into it's Readme.md
 * @param root componentRoot to de-absolutize the DocFileName path
 */
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
