const hash = require('hash-sum')
const compiler = require('vue-template-compiler')
const LRUCache = require('lru-cache')

const cache = new LRUCache(100)

module.exports = function parseVue(source, filename) {
	const cacheKey = hash(filename + source)
	// source-map cache busting for hot-reloadded modules
	let output = cache.get(cacheKey)
	if (output) {
		return output
	}
	output = compiler.parseComponent(source, { pad: false })
	cache.set(cacheKey, output)
	return output
}
