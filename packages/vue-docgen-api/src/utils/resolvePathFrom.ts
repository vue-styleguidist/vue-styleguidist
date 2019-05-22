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
			for (let i = 0; i < from.length; i++) {
				try {
					finalPath = require.resolve(join(from[i], `${path}${s}`));
					if (finalPath.length) {
						break;
					}
				} catch (e) {
					// eat the error
				}
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
