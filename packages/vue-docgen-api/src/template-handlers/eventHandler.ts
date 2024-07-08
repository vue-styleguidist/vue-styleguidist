import { visit } from 'recast'
import { TemplateChildNode, BaseElementNode } from '@vue/compiler-dom'
import Documentation, { Tag } from '../Documentation'
import extractLeadingComment from '../utils/extractLeadingComment'
import getDoclets from '../utils/getDoclets'
import { setEventDescriptor } from '../script-handlers/eventHandler'
import getTemplateExpressionAST from '../utils/getTemplateExpressionAST'
import { isBaseElementNode, isDirectiveNode, isSimpleExpressionNode } from '../utils/guards'

export default function eventHandler(
	documentation: Documentation,
	templateAst: TemplateChildNode,
	siblings: TemplateChildNode[]
) {
	if (isBaseElementNode(templateAst)) {
		templateAst.props.forEach(prop => {
			if (isDirectiveNode(prop)) {
				if (prop.name === 'on') {
					// only look at expressions
					const expression = prop.exp
					if (isSimpleExpressionNode(expression)) {
						getEventsFromExpression(templateAst, expression.content, documentation, siblings)
					}
				}
			}
		})
	}
}

function getEventsFromExpression(
	item: BaseElementNode,
	expression: string,
	documentation: Documentation,
	siblings: TemplateChildNode[]
) {
	const ast = getTemplateExpressionAST(expression)

	const eventsFound: string[] = []
	visit(ast.program, {
		visitCallExpression(path) {
			const obj = path.node ? path.node.callee : undefined
			const args = path.node ? path.node.arguments : undefined
			if (obj && args && obj.type === 'Identifier' && obj.name === '$emit' && args.length) {
				const evtName = args[0].type === 'StringLiteral' ? args[0].value : '<undefined>'
				documentation.getEventDescriptor(evtName)
				eventsFound.push(evtName)
				return false
			}
			this.traverse(path)
			return undefined
		}
	})
	if (eventsFound.length) {
		const leadingComments = extractLeadingComment(siblings, item)
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
