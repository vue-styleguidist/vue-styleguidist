import * as bt from '@babel/types'
import { TemplateChildNode, DirectiveNode } from '@vue/compiler-dom'
import { NodePath } from 'ast-types/lib/node-path'
import { visit, print } from 'recast'
import Documentation, { ParamTag } from '../Documentation'
import buildParser from '../babel-parser'
import { TemplateParserOptions } from '../parse-template'
import extractLeadingComment from '../utils/extractLeadingComment'
import { parseSlotDocBlock } from '../script-handlers/slotHandler'
import {
	isBaseElementNode,
	isAttributeNode,
	isDirectiveNode,
	isSimpleExpressionNode
} from '../utils/guards'

const parser = buildParser({ plugins: ['typescript'] })

export default function slotHandler(
	documentation: Documentation,
	templateAst: TemplateChildNode,
	siblings: TemplateChildNode[],
	options: TemplateParserOptions
) {
	if (isBaseElementNode(templateAst) && templateAst.tag === 'slot') {
		const nameProp = templateAst.props.filter(isAttributeNode).find(b => b.name === 'name')
		const slotName =
			nameProp && nameProp.value && nameProp.value.content ? nameProp.value.content : 'default'

		const bindings = templateAst.props.filter(
			// only keep simple binds and static attributes
			b => b.name !== 'name' && (b.name === 'bind' || isAttributeNode(b))
		)

		const slotDescriptor = documentation.getSlotDescriptor(slotName)

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

		const simpleBindings: ParamTag[] = []

		// deal with v-bind="" props
		const simpleVBind = bindings.find(b => isDirectiveNode(b) && !b.arg) as DirectiveNode
		let rawVBind = false
		if (simpleVBind && isSimpleExpressionNode(simpleVBind.exp)) {
			const ast = parser.parse(`() => (${simpleVBind.exp.content})`)
			visit(ast.program, {
				visitObjectExpression(path) {
					path.get('properties').each((property: NodePath) => {
						const node = property.node
						if (bt.isProperty(node) || bt.isObjectProperty(node)) {
							const name = print(property.get('key')).code
							const bindingDesc = bindingDescriptors.filter(t => t.name === name)[0]
							simpleBindings.push(
								bindingDesc
									? bindingDesc
									: {
											name,
											title: 'binding'
									  }
							)
						} else {
							rawVBind = true
						}
					})
					return false
				}
			})
		}

		if (bindings.length) {
			slotDescriptor.bindings = simpleBindings.concat(
				bindings.reduce((acc: ParamTag[], b) => {
					if (!rawVBind && isDirectiveNode(b) && !b.arg) {
						return acc
					}

					// resolve name of binding
					const name =
						isDirectiveNode(b) && b.arg && isSimpleExpressionNode(b.arg)
							? b.arg.content
							: `${isDirectiveNode(b) ? 'v-' : ''}${b.name}`
					const bindingDesc = bindingDescriptors.filter(t => t.name === name)[0]
					acc.push(bindingDesc ? bindingDesc : { name, title: 'binding' })
					return acc
				}, [])
			)
		}
	}
}
