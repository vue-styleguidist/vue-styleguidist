import { ComponentDoc } from 'vue-docgen-api'
import { generate } from 'escodegen'
import { writeFile } from 'fs'
import { format } from 'prettier'
import traverse from 'traverse'
import toAst from 'to-ast'
import { walk } from 'estree-walker'
import setAtPath from './setAtPath'

const EXCLUDED_KEYS = ['author', 'version', 'model']

function generateTranslationObject(originalDoc: ComponentDoc): Record<string, any> {
	const translations: Record<string, any> = {}
	const doc = traverse(originalDoc)
	doc.forEach(function(description) {
		if (
			this.key === 'description' &&
			this.parent &&
			!(
				this.parent.parent &&
				this.parent.parent.parent &&
				this.parent.parent.parent.key === 'tags' &&
				EXCLUDED_KEYS.includes(this.parent.parent.key || '')
			)
		) {
			setAtPath(translations, this.path, description)
		}
	})
	return translations
}

interface LiteralNode {
	value: string
}

function isLiteral(node: any): node is LiteralNode {
	return !!node.value
}

export function generateTranslation(originalDoc: ComponentDoc): string {
	const trans = generateTranslationObject(originalDoc)
	const ast = toAst(trans)
	// Add leading coments (original description) before
	// each description member
	walk(ast as any, {
		enter: node => {
			if (
				node.type === 'Property' &&
				isLiteral(node.key) &&
				node.key.value === 'description' &&
				isLiteral(node.value)
			) {
				node.leadingComments = [{ type: 'Block', value: ` @orig: ${node.value.value}` }]
			}
		}
	})
	return `module.exports = ${generate(ast, { comment: true })}`
}

export default function genFile(originalDoc: ComponentDoc, fileName: string) {
	writeFile(fileName, format(generateTranslation(originalDoc), { parser: 'babel' }), err => {
		if (err) throw err
	})
}
