import { join } from 'path'
import esmResolveNative from 'esm-resolve'
import missingFilesCache from './missing-files-cache'

// fix issues with babel bundles in cjs
const esmResolve = (
	'default' in esmResolveNative ? esmResolveNative.default : esmResolveNative
) as typeof esmResolveNative

const SUFFIXES = ['', '.js', '.ts', '.vue', '.jsx', '.tsx']

export default function resolvePathFrom(path: string, from: string[]): string | null {
	let finalPath: string | null = null

	for (const s of SUFFIXES) {
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
		if (finalPath) {
			break
		}
	}

	try {
		const packagePath = require.resolve(join(path, 'package.json'), {
			paths: from
		})
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const pkg = require(packagePath)
		// if it is an es6 module use the module instead of commonjs
		finalPath = require.resolve(join(path, pkg.module || pkg.main))
	} catch (e: any) {
		// if the error is about the package.json not being found,
		// try to resolve the path naturally
		if (e.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED') {
			try {
				finalPath = esmResolve(from[0])(path) ?? null
			} catch (e) {
				// dismiss the error
			}
		}
		// else dismiss the error
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
