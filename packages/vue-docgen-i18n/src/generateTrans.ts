import { ComponentDoc } from 'vue-docgen-api'
import { generate } from 'escodegen'
import { writeFile } from 'fs'
import { format } from 'prettier'
import traverse from 'traverse'
import toAst from 'to-ast'
import { walk } from 'estree-walker'
import setAtPath from './setAtPath'

const EXCLUDED_KEYS = ['author', 'version', 'model', 'ignore']

function generateTranslationObject(originalDocs: ComponentDoc[]): Record<string, any>[] {
	return originalDocs.map(originalDoc => {
		const translations = { name: originalDoc.exportName }
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
				if (this.parent.keys && this.parent.keys.includes('name')) {
					setAtPath(translations, [...this.parent.path, 'name'], this.parent.node.name)
				}
				setAtPath(translations, this.path, description)
			}
		})
		return translations
	})
}

interface LiteralNode {
	value: string
}

function isLiteral(node: any): node is LiteralNode {
	return !!node.value
}

export function generateTranslation(originalDocs: ComponentDoc[]): string {
	const trans = generateTranslationObject(originalDocs)
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

export default function genFile(originalDocs: ComponentDoc[], fileName: string) {
	writeFile(fileName, format(generateTranslation(originalDocs), { parser: 'babel' }), err => {
		if (err) throw err
	})
}
