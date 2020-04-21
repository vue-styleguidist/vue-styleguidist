import * as bt from '@babel/types'
import recast from 'recast'
import { Node, TemplateChildNode, ExpressionNode } from '@vue/compiler-dom'
import Documentation, { ParamTag } from '../Documentation'
import { TemplateParserOptions } from '../parse-template'
import extractLeadingComment from '../utils/extractLeadingComment'
import getDoclets from '../utils/getDoclets'
import getTemplateExpressionAST from '../utils/getTemplateExpressionAST'
import {
	isBaseElementNode,
	isDirectiveNode,
	isExpressionNode,
	isInterpolationNode
} from '../utils/guards'

export default function propTemplateHandler(
	documentation: Documentation,
	templateAst: TemplateChildNode,
	siblings: TemplateChildNode[],
	options: TemplateParserOptions
) {
	if (options.functional) {
		propsInAttributes(documentation, templateAst, siblings)
		propsInInterpolation(documentation, templateAst, siblings)
	}
}

function propsInAttributes(
	documentation: Documentation,
	templateAst: TemplateChildNode,
	siblings: TemplateChildNode[]
) {
	if (isBaseElementNode(templateAst)) {
		templateAst.props.forEach(prop => {
			if (isDirectiveNode(prop)) {
				getPropsFromExpression(documentation, templateAst, prop.exp, siblings)
			}
		})
	}
}

function propsInInterpolation(
	documentation: Documentation,
	templateAst: TemplateChildNode,
	siblings: TemplateChildNode[]
) {
	if (isInterpolationNode(templateAst)) {
		getPropsFromExpression(documentation, templateAst, templateAst.content, siblings)
	}
}

function getPropsFromExpression(
	documentation: Documentation,
	item: Node,
	exp: ExpressionNode | undefined,
	siblings: TemplateChildNode[]
) {
	if (!isExpressionNode(exp)) {
		return
	}
	const expression = exp.content
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
		const comments = extractLeadingComment(siblings, item)
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
