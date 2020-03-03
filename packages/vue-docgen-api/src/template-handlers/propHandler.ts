import * as bt from '@babel/types'
import recast from 'recast'
import { ASTElement, ASTExpression, ASTNode } from 'vue-template-compiler'
import Documentation, { ParamTag } from '../Documentation'
import { TemplateParserOptions } from '../parse-template'
import extractLeadingComment from '../utils/extractLeadingComment'
import getDoclets from '../utils/getDoclets'
import getTemplateExpressionAST from '../utils/getTemplateExpressionAST'

export default function propTemplateHandler(
	documentation: Documentation,
	templateAst: ASTElement,
	options: TemplateParserOptions
) {
	if (options.functional) {
		propsInAttributes(templateAst, documentation, options)
		propsInInterpolation(templateAst, documentation, options)
	}
}

const allowRE = /^(v-bind|:|v-on|@)/
function propsInAttributes(
	templateAst: ASTElement,
	documentation: Documentation,
	options: TemplateParserOptions
) {
	const bindings = templateAst.attrsMap
	const keys = Object.keys(bindings)
	for (const key of keys) {
		// only look at expressions
		if (allowRE.test(key)) {
			const expression = bindings[key]
			if (expression && expression.length) {
				getPropsFromExpression(templateAst.parent, templateAst, expression, documentation, options)
			}
		}
	}
}

function propsInInterpolation(
	templateAst: ASTElement,
	documentation: Documentation,
	options: TemplateParserOptions
) {
	if (templateAst.children) {
		templateAst.children.filter(c => c.type === 2).forEach((expr: ASTExpression) => {
			getPropsFromExpression(templateAst, expr, expr.expression, documentation, options)
		})
	}
}

function getPropsFromExpression(
	parentAst: ASTElement | undefined,
	item: ASTNode,
	expression: string,
	documentation: Documentation,
	options: TemplateParserOptions
) {
	const ast = getTemplateExpressionAST(expression)
	const propsFound: string[] = []
	recast.visit(ast.program, {
		visitMemberExpression(path) {
			const obj = path.node ? path.node.object : undefined
			const propName = path.node ? path.node.property : undefined
			if (
				obj &&
				propName &&
				bt.isIdentifier(obj) &&
				obj.name === 'props' &&
				bt.isIdentifier(propName)
			) {
				const pName = propName.name
				const p = documentation.getPropDescriptor(pName)
				propsFound.push(pName)
				p.type = { name: 'undefined' }
			}
			return false
		}
	})
	if (propsFound.length) {
		const comments = extractLeadingComment(parentAst, item, options.rootLeadingComment)
		comments.forEach(comment => {
			const doclets = getDoclets(comment)
			const propTags = doclets.tags && (doclets.tags.filter(d => d.title === 'prop') as ParamTag[])
			if (propTags && propTags.length) {
				propsFound.forEach(pName => {
					const propTag = propTags.filter(pt => pt.name === pName)
					if (propTag.length) {
						const p = documentation.getPropDescriptor(pName)
						p.type = propTag[0].type
						if (typeof propTag[0].description === 'string') {
							p.description = propTag[0].description
						}
					}
				})
			}
		})
	}
}
