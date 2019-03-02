import { ASTElement, compile } from 'vue-template-compiler'
import extractLeadingComment from '../extractLeadingComment'

function compileIt(src: string): ASTElement | undefined {
	const ast = compile(src, { comments: true }).ast
	if (ast) {
		const firstHeader = ast.children.filter((a: ASTElement) => a.tag === 'h1') as ASTElement[]
		if (firstHeader.length) {
			return firstHeader[0]
		}
	}
	return ast
}

describe('extractLeadingComment', () => {
	it('should extract single line comments', () => {
		const elt = compileIt(
			[
				'<div>',
				' <div>Hello World !!</div>',
				' <div>Happy Day !!</div>',
				' <!-- single line comment -->',
				' <h1>title of the template</h1>',
				'</div>'
			].join('\n')
		)
		if (!elt) {
			fail()
		} else {
			expect(extractLeadingComment(elt.parent, elt, '')).toBe('single line comment')
		}
	})

	it('should extract multi line comments', () => {
		const elt = compileIt(
			[
				'<div>',
				'  <div>Hello World !!</div>',
				'  <!-- multi line comment -->',
				'  <!-- on 2 lines         -->',
				'  <h1>title of the template</h1>',
				'</div>'
			].join('\n')
		)
		if (elt) {
			expect(extractLeadingComment(elt.parent, elt, '')).toBe(
				['multi line comment', 'on 2 lines'].join('\n')
			)
		} else {
			fail()
		}
	})
})
