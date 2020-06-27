import * as path from 'path'
import * as fs from 'fs'
import { promisify } from 'util'
import chokidar, { FSWatcher } from 'chokidar'
import mkdirpNative from 'mkdirp'
import prettier from 'prettier'
import compileTemplates from './compileTemplates'
import { SafeDocgenCLIConfig } from './config'

const readFile = promisify(fs.readFile)
const mkdirp = promisify(mkdirpNative)

/**
 * Prettify then save a markdown content
 * If the needed directory does not exist, create it
 * @param content dirty looking markdown content to be saved
 * @param destFilePath destination absolute file path
 */
export async function writeDownMdFile(content: string | string[], destFilePath: string) {
	const prettyMd = (cont: string) => prettier.format(cont, { parser: 'markdown' })
	const destFolder = path.dirname(destFilePath)
	await mkdirp(destFolder)
	let writeStream = fs.createWriteStream(destFilePath)
	if (Array.isArray(content)) {
		content.forEach(cont => {
			writeStream.write(prettyMd(cont))
		})
	} else {
		writeStream.write(prettyMd(content))
	}

	// close the stream
	writeStream.close()
}

/**
 * From one component, get a markdown documentation and return it as string
 * @param config configuration
 * @param file relative path of the parsed component
 */
export async function compileMarkdown(config: SafeDocgenCLIConfig, file: string): Promise<string> {
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
 *
 * @param components glob or globs to watch
 * @param cwd option to pass chokidar
 * @param getDocFileName a function to go from component to doc file
 */
export async function getSources(
	components: string | string[],
	cwd: string,
	getDocFileName: (componentPath: string) => string
): Promise<{ watcher: FSWatcher; docMap: { [filepath: string]: string }; componentFiles: string[] }> {
	const watcher = chokidar.watch(components, { cwd })
	await ready(watcher)
	const watchedFilesObject = watcher.getWatched()
	const componentFiles = Object.keys(watchedFilesObject).reduce(
		(acc: string[], directory) => acc.concat(watchedFilesObject[directory].map(p => path.join(directory, p))),
		[]
	)
	const docMap = getDocMap(componentFiles, getDocFileName, cwd)
	watcher.add(Object.keys(docMap))

	return { watcher, docMap, componentFiles }
}

function ready(watcher: FSWatcher): Promise<null> {
	return new Promise(function (resolve) {
		watcher.on('ready', resolve)
	})
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
		const docFilePath = getDocFileName(path.join(root, f))
		docMap[path.relative(root, docFilePath)] = f
	})
	return docMap
}
