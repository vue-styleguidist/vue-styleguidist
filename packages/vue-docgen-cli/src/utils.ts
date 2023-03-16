import * as path from 'path'
import * as fs from 'fs'
import { promisify } from 'util'
import prettier from 'prettier'

const mkdirp = promisify(fs.mkdir)

/**
 * Prettify then save a markdown content
 * If the needed directory does not exist, create it
 * @param content dirty looking markdown content to be saved
 * @param destFilePath destination absolute file path
 */
export async function writeDownMdFile(content: string | string[], destFilePath: string) {
	const conf = await prettier.resolveConfig(destFilePath)
	const prettyMd = (cont: string) =>
		prettier.format(cont, Object.assign(conf || {}, { parser: 'markdown' }))
	const destFolder = path.dirname(destFilePath)
	await mkdirp(destFolder, { recursive: true })
	const writeStream = fs.createWriteStream(destFilePath)
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
	getDocFileName: (file: string) => string | string[] | false,
	root: string
): { [filepath: string]: string } {
	const docMap: { [filepath: string]: string } = {}
	files.forEach(f => {
		const docFilePath = normalizePaths(getDocFileName(path.join(root, f)))

		docFilePath.forEach(doc => {
			docMap[path.relative(root, doc)] = f
		})
	})
	return docMap
}

/**
 * Find a file in a directory, case-insensitive
 *
 * @param {string} filepath
 * @return {string|undefined} File path with correct case
 */
export function findFileCaseInsensitive(filepath: string): string | undefined {
	const dir = path.dirname(filepath)
	const fileNameLower = path.basename(filepath).toLowerCase()
	const files = fs.readdirSync(dir)
	const found = files.find(file => file.toLowerCase() === fileNameLower)
	return found && path.join(dir, found)
}

export function normalizePaths(path: string | string[] | false) {
	if (!path) return []
	return Array.isArray(path) ? path : [path]
}
