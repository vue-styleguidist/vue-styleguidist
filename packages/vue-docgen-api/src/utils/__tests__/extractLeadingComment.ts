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
	it('should extract single line comments', done => {
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
			done.fail()
		} else {
			expect(extractLeadingComment(elt.parent, elt, [])[0]).toBe('single line comment')
			done()
		}
	})

	it('should extract multi line comments', done => {
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
			expect(extractLeadingComment(elt.parent, elt, [])).toEqual([
				'multi line comment',
				'on 2 lines'
			])
			done()
		} else {
			done.fail()
		}
	})

	it('should extract multi line comment blocks', done => {
		const elt = compileIt(
			[
				'<div>',
				'  <div>Hello World !!</div>',
				'  <!--',
				'	multi line comment',
				'   on 2 lines',
				'  -->',
				'  <!-- single line comment -->',
				'  <h1>title of the template</h1>',
				'</div>'
			].join('\n')
		)
		if (elt) {
			const comments = extractLeadingComment(elt.parent, elt, [])
			expect(comments[0]).toEqual(['multi line comment', '   on 2 lines'].join('\n'))
			expect(comments[1]).toEqual('single line comment')
			done()
		} else {
			done.fail()
		}
	})

	it('should extract comment blocks when first sibling', done => {
		const elt = compileIt(
			[
				'<div>',
				'  <!--',
				'	multi line comment',
				'   on 2 lines',
				'  -->',
				'  <!-- single line comment -->',
				'  <h1>title of the template</h1>',
				'</div>'
			].join('\n')
		)
		if (elt) {
			const comments = extractLeadingComment(elt.parent, elt, [])
			expect(comments[0]).toEqual(['multi line comment', '   on 2 lines'].join('\n'))
			expect(comments[1]).toEqual('single line comment')
			done()
		} else {
			done.fail()
		}
	})
})
