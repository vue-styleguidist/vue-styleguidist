//import * as bt from '@babel/types'
import { TemplateChildNode } from '@vue/compiler-dom'
//import recast, { NodePath } from 'recast'
import Documentation, { ParamTag } from '../Documentation'
//import buildParser from '../babel-parser'
import { TemplateParserOptions } from '../parse-template'
import extractLeadingComment from '../utils/extractLeadingComment'
import { parseSlotDocBlock } from '../script-handlers/slotHandler'
import { isBaseElementNode, isAttributeNode } from '../utils/guards'

//const parser = buildParser({ plugins: ['typescript'] })

export default function slotHandler(
	documentation: Documentation,
	templateAst: TemplateChildNode,
	siblings: TemplateChildNode[],
	options: TemplateParserOptions
) {
	if (isBaseElementNode(templateAst) && templateAst.tag === 'slot') {
		const nameProp = templateAst.props.filter(isAttributeNode).find(b => b.name === 'name')
		const name =
			nameProp && nameProp.value && nameProp.value.content ? nameProp.value.content : 'default'

		const bindings = templateAst.props.filter(b => b.name !== 'name')

		// deal with v-bind="" props
		// if (bindings['']) {
		// 	const vBindCode = templateAst.attrsMap['v-bind']
		// 	const ast = parser.parse(`() => (${vBindCode})`)
		// 	let rawVBind = false
		// 	recast.visit(ast.program, {
		// 		visitObjectExpression(path) {
		// 			if (!path.node) {
		// 				return false
		// 			}
		// 			path.get('properties').each((property: NodePath) => {
		// 				const node = property.node
		// 				if (bt.isProperty(node) || bt.isObjectProperty(node)) {
		// 					bindings[node.key.name] = recast.print(property.get('value')).code
		// 				} else {
		// 					rawVBind = true
		// 				}
		// 			})
		// 			return false
		// 		}
		// 	})
		// 	if (rawVBind) {
		// 		bindings['v-bind'] = vBindCode
		// 	}
		// 	delete bindings['']
		// }

		const slotDescriptor = documentation.getSlotDescriptor(name)

		if (bindings.length) {
			slotDescriptor.scoped = true
		}

		const comments = extractLeadingComment(siblings, templateAst)
		let bindingDescriptors: ParamTag[] = []

		comments.forEach(comment => {
			// if a comment contains @slot,
			// use it to determine bindings and tags
			// if multiple @slot, use the last one
			if (comment.length) {
				const doclets = parseSlotDocBlock(comment, slotDescriptor)
				if (doclets && doclets.bindings) {
					bindingDescriptors = doclets.bindings
				}
			}
		})

		if (bindings.length) {
			slotDescriptor.bindings = bindings.map(b => {
				const bindingDesc = bindingDescriptors.filter(t => t.name === b.name)[0]
				return bindingDesc || { name: b.name }
			})
		}
	}
}
