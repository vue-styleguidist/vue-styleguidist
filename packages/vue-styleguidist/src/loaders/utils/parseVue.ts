import hash from 'hash-sum'
import { parse, SFCParseResult } from '@vue/compiler-sfc'
import LRUCache from 'lru-cache'

const cache = new LRUCache(100)

export default function parseVue(source: string, filename: string):SFCParseResult {
	const cacheKey = hash(filename + source)
	// source-map cache busting for hot-reloadded modules
	let output = cache.get(cacheKey)
	if (output) {
		return output
	}
	output = parse(source)
	cache.set(cacheKey, output)
	return output
}
