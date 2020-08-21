/* eslint-disable @typescript-eslint/no-var-requires */
const LRUCache = require('lru-cache')
const hash = require('hash-sum')

const cache = new LRUCache(250)

export default function <T>(creator: () => T, ...argsKey: string[]): T {
	const cacheKey = hash(argsKey.join(''))

	// source-map cache busting for hot-reloadded modules
	let output: T = cache.get(cacheKey)
	if (output) {
		return output
	}
	output = creator()
	cache.set(cacheKey, output)
	return output
}
