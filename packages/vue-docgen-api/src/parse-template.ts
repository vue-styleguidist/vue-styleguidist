import * as pug from 'pug'
import { parse, TemplateChildNode, RootNode } from '@vue/compiler-dom'
import { SFCTemplateBlock } from '@vue/compiler-sfc'
import Documentation from './Documentation'
import cacher from './utils/cacher'
import { ParseOptions } from './parse'

export interface TemplateParserOptions {
	functional: boolean
}

export type Handler = (
	documentation: Documentation,
	templateAst: TemplateChildNode,
	siblings: TemplateChildNode[],
	options: TemplateParserOptions
) => void

export default function parseTemplate(
	tpl: Pick<SFCTemplateBlock, 'content' | 'attrs'>,
	documentation: Documentation,
	handlers: Handler[],
	opts: ParseOptions
) {
	const { filePath, pugOptions } = opts
	if (tpl && tpl.content) {
		const source =
			tpl.attrs && tpl.attrs.lang === 'pug'
				? pug.render(tpl.content, { ...pugOptions, filename: filePath })
				: tpl.content

		const ast: RootNode = cacher(() => parse(source), source)

		const functional = !!tpl.attrs.functional
		if (functional) {
			documentation.set('functional', functional)
		}

		if (ast) {
			ast.children.forEach(child =>
				traverse(child, documentation, handlers, ast.children, {
					functional
				})
			)
		}
	}
}

function hasChildren(child: any): child is { children: TemplateChildNode[] } {
	return !!child.children
}

export function traverse(
	templateAst: TemplateChildNode,
	documentation: Documentation,
	handlers: Handler[],
	siblings: TemplateChildNode[],
	options: TemplateParserOptions
) {
	const traverseAstChildren = (templateAst: TemplateChildNode) => {
		if (hasChildren(templateAst)) {
			const { children } = templateAst
			for (const childNode of children) {
				traverse(childNode, documentation, handlers, children, options)
			}
		}
	}

	handlers.forEach(handler => {
		handler(documentation, templateAst, siblings, options)
	})

	traverseAstChildren(templateAst)
}
