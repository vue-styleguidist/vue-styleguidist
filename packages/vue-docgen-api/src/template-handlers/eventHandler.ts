import * as bt from '@babel/types'
import recast from 'recast'
import { ASTElement, ASTNode } from 'vue-template-compiler'
import Documentation, { Tag } from '../Documentation'
import { TemplateParserOptions } from '../parse-template'
import extractLeadingComment from '../utils/extractLeadingComment'
import getDoclets from '../utils/getDoclets'
import { setEventDescriptor } from '../script-handlers/eventHandler'
import getTemplateExpressionAST from '../utils/getTemplateExpressionAST'

const allowRE = /^(v-on|@)/
export default function eventHandler(
	documentation: Documentation,
	templateAst: ASTElement,
	options: TemplateParserOptions
) {
	const bindings = templateAst.attrsMap
	const keys = Object.keys(bindings)
	for (const key of keys) {
		// only look at expressions
		if (allowRE.test(key)) {
			const expression = bindings[key]
			if (expression && expression.length) {
				getEventsFromExpression(templateAst.parent, templateAst, expression, documentation, options)
			}
		}
	}
}

function getEventsFromExpression(
	parentAst: ASTElement | undefined,
	item: ASTNode,
	expression: string,
	documentation: Documentation,
	options: TemplateParserOptions
) {
	const ast = getTemplateExpressionAST(expression)

	const eventsFound: string[] = []
	recast.visit(ast.program, {
		visitCallExpression(path) {
			const obj = path.node ? path.node.callee : undefined
			const args = path.node ? path.node.arguments : undefined
			if (obj && args && bt.isIdentifier(obj) && obj.name === '$emit' && args.length) {
				const evtName = bt.isStringLiteral(args[0]) ? args[0].value : '<undefined>'
				documentation.getEventDescriptor(evtName)
				eventsFound.push(evtName)
				return false
			}
			this.traverse(path)
		}
	})
	if (eventsFound.length) {
		const leadingComments = extractLeadingComment(parentAst, item, options.rootLeadingComment)
		if (leadingComments.length) {
			eventsFound.forEach(evtName => {
				leadingComments.forEach(comment => {
					const doclets = getDoclets(comment)
					const eventTags = doclets.tags && (doclets.tags.filter(d => d.title === 'event') as Tag[])
					if (
						!(
							eventTags &&
							eventTags.length &&
							eventTags.findIndex(et => et.content === evtName) > -1
						)
					) {
						return
					}
					const e = documentation.getEventDescriptor(evtName)
					setEventDescriptor(e, doclets)
				})
			})
		}
	}
}
