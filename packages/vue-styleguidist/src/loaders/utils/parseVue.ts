import hash from 'hash-sum'
import * as compiler from 'vue-template-compiler'
import LRUCache from 'lru-cache'

const cache = new LRUCache(100)

export default function parseVue(source: string, filename: string): compiler.SFCDescriptor {
	const cacheKey = hash(filename + source)
	// source-map cache busting for hot-reloadded modules
	let output = cache.get(cacheKey)
	if (output) {
		return output
	}
	output = compiler.parseComponent(source)
	cache.set(cacheKey, output)
	return output
}
