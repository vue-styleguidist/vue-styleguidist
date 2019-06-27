import { ASTElement } from 'vue-template-compiler'
import recast, { NodePath } from 'recast'
import { Documentation } from '../Documentation'
import buildParser from '../babel-parser'
import { TemplateParserOptions } from '../parse-template'
import extractLeadingComment from '../utils/extractLeadingComment'
import * as bt from '@babel/types'

const parser = buildParser({ plugins: ['typescript'] })

export default function slotHandler(
	documentation: Documentation,
	templateAst: ASTElement,
	options: TemplateParserOptions
) {
	if (templateAst.tag === 'slot') {
		const bindings = extractAndFilterAttr(templateAst.attrsMap)

		let name = 'default'
		if (bindings.name) {
			name = bindings.name
			delete bindings.name
		}

		if (bindings['']) {
			const vBindCode = templateAst.attrsMap['v-bind']
			const ast = parser.parse(`() => (${vBindCode})`)
			let rawVBind = false
			recast.visit(ast.program, {
				visitObjectExpression(path) {
					if (!path.node) {
						return false
					}
					path.get('properties').each((property: NodePath) => {
						const node = property.node
						if (bt.isProperty(node) || bt.isObjectProperty(node)) {
							bindings[node.key.name] = recast.print(property.get('value')).code
						} else {
							rawVBind = true
						}
					})
					return false
				}
			})
			if (rawVBind) {
				bindings['v-bind'] = vBindCode
			}
			delete bindings['']
		}

		const slotDescriptor = documentation.getSlotDescriptor(name)

		if (bindings && Object.keys(bindings).length) {
			slotDescriptor.scoped = true
		}

		slotDescriptor.bindings = bindings

		const comment = extractLeadingComment(
			templateAst.parent,
			templateAst,
			options.rootLeadingComment
		)
		if (comment.length && comment.search(/@slot/) !== -1) {
			slotDescriptor.description = comment.replace('@slot', '').trim()
		}
	}
}

const dirRE = /^(v-|:|@)/
const allowRE = /^(v-bind|:)/

function extractAndFilterAttr(attrsMap: Record<string, any>): Record<string, any> {
	const res: Record<string, any> = {}
	const keys = Object.keys(attrsMap)
	for (const key of keys) {
		if (!dirRE.test(key) || allowRE.test(key)) {
			res[key.replace(allowRE, '')] = attrsMap[key]
		}
	}
	return res
}
