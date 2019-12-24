import { ComponentDoc } from 'vue-docgen-api'
import { generate } from 'escodegen'
import { writeFile } from 'fs'
import { format } from 'prettier'
import traverse from './traverse'
import getOrCreateObjectAtPath from './getOrCreateObjectAtPath'

import toAst = require('to-ast')

function generateTranslationObject(originalDoc: ComponentDoc): Record<string, any> {
	const translations: Record<string, any> = {}
	traverse(originalDoc, (key, object, path) => {
		if (key === 'description') {
			const trans = getOrCreateObjectAtPath(originalDoc, path)
			if (trans && trans.description) {
				getOrCreateObjectAtPath(translations, path).name = trans.name
				getOrCreateObjectAtPath(translations, path).description = trans.description
			}
		}
	})
	return originalDoc
}

export default function generateTranslationFile(originalDoc: ComponentDoc, fileName: string) {
	const trans = generateTranslationObject(originalDoc)
	const ast = toAst(trans)
	// TODO: Add leading coments (original description) before
	// each description member
	const fileContent = `module.exports = ${generate(ast)}`
	writeFile(fileName, format(fileContent), err => {
		if (err) throw err
	})
}
