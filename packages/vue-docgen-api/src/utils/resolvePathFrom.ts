import { join } from 'path'
import missingFilesCache from './missing-files-cache'

const SUFFIXES = ['', '.js', '.ts', '.vue', '.jsx', '.tsx']

export default function resolvePathFrom(path: string, from: string[]): string | null {
	let finalPath: string | null = null

	SUFFIXES.forEach(s => {
		if (!finalPath) {
			try {
				finalPath = require.resolve(`${path}${s}`, {
					paths: from
				})
			} catch (e) {
				// eat the error
			}
		}
		if (!finalPath) {
			try {
				finalPath = require.resolve(join(path, `index${s}`), {
					paths: from
				})
			} catch (e) {
				// eat the error
			}
		}
		if (!finalPath) {
			for (let i = 0; i < from.length; i++) {
				try {
					finalPath = require.resolve(join(from[i], `${path}${s}`))
					if (finalPath.length) {
						break
					}
				} catch (e) {
					// eat the error
				}
			}
		}
	})

	try {
		const packagePath = require.resolve(join(path, 'package.json'), {
			paths: from
		})
		const pkg = require(packagePath)
		// if it is an es6 module use the module instead of commonjs
		finalPath = require.resolve(join(path, pkg.module || pkg.main))
	} catch (e) {
		// eat the error
	}

	if (!finalPath) {
		if (!missingFilesCache[path]) {
			// eslint-disable-next-line no-console
			console.warn(
				`Neither '${path}.vue' nor '${path}.js(x)' or '${path}/index.js(x)' or '${path}/index.ts(x)' could be found in '${from}'`
			)
			missingFilesCache[path] = true
		}
	}

	return finalPath
}
