const { join } = require('path');

const SUFFIXES = ['', '.js', '.ts', '.vue', '.jsx', '.tsx']

export default function resolvePathFrom(path: string, from: string[]): string {
	let finalPath = ''
	SUFFIXES.forEach(s => {
		if (!finalPath.length) {
			try {
				finalPath = require.resolve(`${path}${s}`, {
					paths: from
				})
			} catch (e) {
				// eat the error
			}
		}
		if (!finalPath.length) {
			try {
				finalPath = require.resolve(join(path, `index${s}`), {
					paths: from
				})
			} catch (e) {
				// eat the error
			}
		}
		if (!finalPath.length) {
			try {
				finalPath = require.resolve(join(from[0], `${path}${s}`))
			} catch (e) {
				// eat the error
			}
		}
	})

	if (!finalPath.length) {
		throw new Error(
			`Neither '${path}.vue' nor '${path}.js(x)' or '${path}/index.js(x)' or '${path}/index.ts(x)' could be found in '${from}'`
		)
	}

	return finalPath
}
