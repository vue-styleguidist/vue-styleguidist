import { parse, BaseElementNode } from '@vue/compiler-dom'
import extractLeadingComment from '../extractLeadingComment'

function isBaseElementNode(a: any): a is BaseElementNode {
	return a.tag !== undefined
}

function compileIt(src: string): { parent: BaseElementNode; child: BaseElementNode } | undefined {
	const [ast] = parse(src).children
	if (isBaseElementNode(ast)) {
		const firstHeader = (ast.children.filter(
			a => isBaseElementNode(a) && a.tag === 'h1'
		) as unknown) as BaseElementNode[]
		if (firstHeader.length) {
			return { parent: ast, child: firstHeader[0] }
		}
	}
	return undefined
}

describe('extractLeadingComment', () => {
	it('should not fail when no comment', done => {
		const elt = compileIt(
			[
				'<div>', //
				' <h1>title of the template</h1>',
				'</div>'
			].join('\n')
		)
		if (!elt) {
			done.fail()
		} else {
			expect(extractLeadingComment([], elt.child).length).toBe(0)
			done()
		}
	})

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
			expect(extractLeadingComment(elt.parent.children, elt.child)[0]).toBe('single line comment')
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
			expect(extractLeadingComment(elt.parent.children, elt.child)).toEqual([
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
			const comments = extractLeadingComment(elt.parent.children, elt.child)
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
			const comments = extractLeadingComment(elt.parent.children, elt.child)
			expect(comments[0]).toEqual(['multi line comment', '   on 2 lines'].join('\n'))
			expect(comments[1]).toEqual('single line comment')
			done()
		} else {
			done.fail()
		}
	})
})
