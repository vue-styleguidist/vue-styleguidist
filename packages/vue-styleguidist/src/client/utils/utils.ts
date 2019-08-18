/**
 * Remove quotes around given string.
 *
 * @param {string} string
 * @returns {string}
 */
export function unquote(string: string): string {
	return string.replace(/^['"]|['"]$/g, '')
}

/**
 * Show starting and ending whitespace around given string.
 *
 * @param {string} string
 * @returns {string}
 */
export function showSpaces(string: string): string {
	return string.replace(/^\s|\s$/g, '␣')
}
