import * as bt from '@babel/types'
import { ASTElement } from 'vue-template-compiler'
import recast, { NodePath } from 'recast'
import Documentation, { Tag, ParamTag } from '../Documentation'
import buildParser from '../babel-parser'
import { TemplateParserOptions } from '../parse-template'
import extractLeadingComment from '../utils/extractLeadingComment'
import getDoclets from '../utils/getDoclets'

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

		const comment = extractLeadingComment(
			templateAst.parent,
			templateAst,
			options.rootLeadingComment
		)
		let bindingDescriptors: ParamTag[] = []
		if (comment.length) {
			const doclets = getDoclets(comment)
			if (doclets.tags) {
				slotDescriptor.description = ((doclets.tags.filter(t => t.title === 'slot')[0] as Tag)
					.content as string).trim()
				bindingDescriptors = doclets.tags.filter(t => t.title === 'binding') as ParamTag[]
			}
		}
		slotDescriptor.bindings = Object.keys(bindings).map(b => {
			const bindingDesc = bindingDescriptors.filter(t => t.name === b)[0]
			return bindingDesc || { name: b }
		})
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
