import * as pug from 'pug'
import { parse, TemplateChildNode, RootNode, BaseElementNode } from '@vue/compiler-dom'
import { SFCTemplateBlock } from '@vue/compiler-sfc'
import Documentation from './Documentation'
import cacher from './utils/cacher'

export interface TemplateParserOptions {
	functional: boolean
	rootLeadingComment: string[]
}

export type Handler = (
	documentation: Documentation,
	templateAst: TemplateChildNode,
	options: TemplateParserOptions
) => void

export default function parseTemplate(
	tpl: Pick<SFCTemplateBlock, 'content' | 'attrs'>,
	documentation: Documentation,
	handlers: Handler[],
	filePath: string
) {
	if (tpl && tpl.content) {
		const source =
			tpl.attrs && tpl.attrs.lang === 'pug'
				? pug.render(tpl.content, { filename: filePath })
				: tpl.content

		const ast: RootNode = cacher(() => parse(source), source)

		const functional = !!tpl.attrs.functional
		if (functional) {
			documentation.set('functional', functional)
		}

		const rootLeadingComment = extractRootLeadingComments(source)

		if (ast) {
			ast.children.forEach(child =>
				traverse(child, documentation, handlers, {
					functional,
					rootLeadingComment
				})
			)
		}
	}
}

function hasChildren(child: any): child is BaseElementNode {
	return !!child.children
}

export function traverse(
	templateAst: TemplateChildNode,
	documentation: Documentation,
	handlers: Handler[],
	options: TemplateParserOptions
) {
	const traverseAstChildren = (templateAst: TemplateChildNode) => {
		if (hasChildren(templateAst)) {
			const { children } = templateAst
			for (const childNode of children) {
				if (hasChildren(childNode)) {
					traverse(childNode, documentation, handlers, options)
				}
			}
		}
	}

	if (templateAst.type === 1) {
		handlers.forEach(handler => {
			handler(documentation, templateAst, options)
		})
	}

	traverseAstChildren(templateAst)
}

function extractRootLeadingComments(template: string): string[] {
	let t = template.trim()
	const comments = []
	while (/^<!--/.test(t)) {
		const endOfRootLeadingComment = t.indexOf('-->')
		const rootLeadingComment = t.slice(4, endOfRootLeadingComment).trim()
		comments.push(rootLeadingComment)
		t = t.slice(endOfRootLeadingComment + 3).trim()
	}

	return comments
}
