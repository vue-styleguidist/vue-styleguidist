const parseVue = require('./parseVue')
const path = require('path')
const fs = require('fs')

const readSeparateScriptFile = fileName => {
	return fs.readFileSync(fileName, { encoding: 'utf-8' })
}

module.exports = function getComponentVueDoc(source, file) {
	const parts = parseVue(source, file)

	if (parts.customBlocks) {
		const docBlocks = parts.customBlocks.filter(block => block.type === 'docs')[0]
		if (docBlocks && docBlocks.src) {
			const jsFilePath = path.join(path.dirname(file), parts.script.src)
			return readSeparateScriptFile(jsFilePath)
		} else if (docBlocks && docBlocks.content) {
			return docBlocks.content
		}
	}
	return false
}
