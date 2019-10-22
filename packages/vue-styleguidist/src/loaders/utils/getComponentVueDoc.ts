import * as fs from 'fs'
import * as path from 'path'
import parseVue from './parseVue'

const readSeparateScriptFile = (fileName: string) => {
	return fs.readFileSync(fileName, { encoding: 'utf-8' })
}

export default function getComponentVueDoc(source: string, file: string): string | false {
	const parts = parseVue(source, file)

	if (parts.customBlocks) {
		const docBlocks = parts.customBlocks.filter(block => block.type === 'docs')[0]
		if (docBlocks && docBlocks.src) {
			const jsFilePath = path.join(path.dirname(file), docBlocks.src)
			return readSeparateScriptFile(jsFilePath)
		} else if (docBlocks && docBlocks.content) {
			return docBlocks.content
		}
	}
	return false
}
