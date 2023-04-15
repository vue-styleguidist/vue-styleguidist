import * as pug from 'pug'
import { parse, TemplateChildNode, RootNode } from '@vue/compiler-dom'
import { SFCTemplateBlock } from '@vue/compiler-sfc'
import Documentation from './Documentation'
import cacher from './utils/cacher'
import type { ParseOptions, TemplateHandler } from './types'

export interface TemplateParserOptions {
	functional: boolean
}

export default function parseTemplate(
	tpl: Pick<SFCTemplateBlock, 'content' | 'attrs'>,
	documentation: Documentation,
	handlers: TemplateHandler[],
	opts: ParseOptions
) {
	const { filePath, pugOptions } = opts
	if (tpl && tpl.content) {
		const source =
			tpl.attrs && tpl.attrs.lang === 'pug'
				? pug.render(tpl.content.trim(), {
						doctype: 'html',
						...pugOptions,
						filename: filePath
					})
				: tpl.content

		const ast: RootNode = cacher(() => parse(source, { comments: true }), source)

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
	handlers: TemplateHandler[],
	siblings: TemplateChildNode[],
	options: TemplateParserOptions
) {
	const traverseAstChildren = (ast: TemplateChildNode) => {
		if (hasChildren(ast)) {
			const { children } = ast
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
