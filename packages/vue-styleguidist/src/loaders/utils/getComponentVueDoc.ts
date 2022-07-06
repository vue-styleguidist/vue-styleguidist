import * as fs from 'fs'
import * as path from 'path'
import parseVue from './parseVue'

const readSeparateScriptFile = (fileName: string) => {
	return fs.readFileSync(fileName, { encoding: 'utf-8' })
}

export default function getComponentVueDoc(source: string, file: string): string | false {
	const descriptor = parseVue(source)

	const docBlocks = descriptor.customBlocks?.filter(block => block.type === 'docs')[0]
	if (docBlocks?.src) {
		const jsFilePath = path.join(path.dirname(file), docBlocks.src)
		return readSeparateScriptFile(jsFilePath)
	} else if (docBlocks?.content) {
		return docBlocks.content
	}

	return false
}
