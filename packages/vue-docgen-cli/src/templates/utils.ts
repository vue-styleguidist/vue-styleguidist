import fs from 'fs'
import path from 'path'
import memoize from 'lodash.memoize'

/**
 * replaces returns and tubes to make the input compatible with markdown
 * @param input
 */
export function mdclean(input: string): string {
	return input.replace(/\r?\n/g, '<br>').replace(/\|/g, '\\|')
}

const readdirSync = memoize(fs.readdirSync)

/**
 * Find a file in a directory, case-insensitive
 *
 * @param {string} filepath
 * @return {string|undefined} File path with correct case
 */
export function findFileCaseInsensitive(filepath: string): string | undefined {
	const dir = path.dirname(filepath)
	const fileNameLower = path.basename(filepath).toLowerCase()
	const files = readdirSync(dir)
	const found = files.find((file: string) => file.toLowerCase() === fileNameLower)
	return found && path.join(dir, found)
}

/**
 * Clear cache.
 */
export function clearCache() {
	const sync = readdirSync.cache as any
	sync.clear()
}
