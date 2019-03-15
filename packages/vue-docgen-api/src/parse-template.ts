import * as pug from 'pug'
import { ASTElement, ASTNode, compile, SFCBlock } from 'vue-template-compiler'
import { Documentation } from './Documentation'
import cacher from './utils/cacher'

export interface TemplateParserOptions {
	functional: boolean
	rootLeadingComment: string
}

export type Handler = (
	documentation: Documentation,
	templateAst: ASTElement,
	options: TemplateParserOptions
) => void

export default function parseTemplate(
	tpl: SFCBlock,
	documentation: Documentation,
	handlers: Handler[],
	filePath: string
) {
	if (tpl && tpl.content) {
		const template =
			tpl.attrs && tpl.attrs.lang === 'pug'
				? pug.render(tpl.content, { filename: filePath })
				: tpl.content
		const ast = cacher(() => compile(template, { comments: true, optimize: false }).ast, template)
		const rootLeadingCommentArray = /^<!--(.+)-->/.exec(template.trim())
		const rootLeadingComment =
			rootLeadingCommentArray && rootLeadingCommentArray.length > 1
				? rootLeadingCommentArray[1].trim()
				: ''
		const functional = !!tpl.attrs.functional
		if (functional) {
			documentation.set('functional', functional)
		}

		if (ast) {
			traverse(ast, documentation, handlers, {
				functional,
				rootLeadingComment
			})
		}
	}
}

export function traverse(
	templateAst: ASTElement,
	documentation: Documentation,
	handlers: Handler[],
	options: TemplateParserOptions
) {
	const traverseAstChildren = (templateAst: ASTElement) => {
		if (templateAst.children) {
			for (const childNode of templateAst.children) {
				if (isASTElement(childNode)) {
					traverse(childNode, documentation, handlers, options)
				}
			}
		}
	}

	if (templateAst.type === 1) {
		handlers.forEach(handler => {
			handler(documentation, templateAst, options)
		})
		if (templateAst.if && templateAst.ifConditions) {
			// for if statement iterate through the branches
			templateAst.ifConditions.forEach(({ block }) => {
				traverseAstChildren(block)
			})
		} else {
			traverseAstChildren(templateAst)
		}
	}
}

function isASTElement(node: ASTNode): node is ASTElement {
	return !!node && (node as ASTElement).children !== undefined
}
