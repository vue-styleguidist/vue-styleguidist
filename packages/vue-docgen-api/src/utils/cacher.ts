import LRUCache from 'lru-cache'
import hash from 'hash-sum'

const cache = new LRUCache({ max: 250 })

export default function <T extends {}>(creator: () => T, ...argsKey: string[]): T {
	const cacheKey = hash(argsKey.join(''))

	// source-map cache busting for hot-reloadded modules
	let output: T | undefined = (cache as LRUCache<string, T>).get(cacheKey)
	if (output) {
		return output
	}
	output = creator()
	cache.set(cacheKey, output)
	return output
}
