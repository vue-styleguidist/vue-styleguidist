import { ComponentDoc } from 'vue-docgen-api'
import { generate } from 'escodegen'
import { writeFile } from 'fs'
import { format } from 'prettier'
import traverse from 'traverse'
import toAst from 'to-ast'
import { setAtPath } from './getOrCreateObjectAtPath'

function generateTranslationObject(originalDoc: ComponentDoc): Record<string, any> {
	const translations: Record<string, any> = {}
	const doc = traverse(originalDoc)
	doc.forEach(function(description) {
		if (this.key === 'description' && this.parent) {
			setAtPath(translations, this.path, description)
		}
	})
	return translations
}

export function generateTranslation(originalDoc: ComponentDoc): string {
	const trans = generateTranslationObject(originalDoc)
	const ast = toAst(trans)
	// TODO: Add leading coments (original description) before
	// each description member
	return `module.exports = ${generate(ast)}`
}

export default function genFile(originalDoc: ComponentDoc, fileName: string) {
	writeFile(fileName, format(generateTranslation(originalDoc)), err => {
		if (err) throw err
	})
}
