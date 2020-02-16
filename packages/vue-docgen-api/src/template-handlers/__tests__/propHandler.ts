import { compile } from 'vue-template-compiler'
import Documentation from '../../Documentation'
import { traverse } from '../../parse-template'
import propHandler from '../propHandler'

describe('slotHandler', () => {
	let doc: Documentation
	beforeEach(() => {
		doc = new Documentation('dummy/path')
	})

	it('should match props in attributes expressions', done => {
		const ast = compile(
			[
				'<div>',
				'  <h1>titleof the template</h1>',
				'  <!--',
				'    @prop {number} size width of the button',
				'    @prop {string} value value in the form',
				'   -->',
				'  <!-- separative comment -->',
				'  <button :style="`width:${props.size}`" :value="props.value"></button>',
				'</div>'
			].join('\n'),
			{ comments: true }
		).ast
		if (ast) {
			traverse(ast, doc, [propHandler], { functional: true, rootLeadingComment: [] })
			expect(doc.toObject().props).toMatchObject([
				{ name: 'size', type: { name: 'number' }, description: 'width of the button' },
				{ name: 'value', type: { name: 'string' }, description: 'value in the form' }
			])
			done()
		} else {
			done.fail()
		}
	})

	it('should match props in interpolated text', done => {
		const ast = compile(
			[
				'<div>',
				'  <h1>titleof the template</h1>',
				'  <button style="width:200px">',
				'    <!-- @prop name Your Name -->',
				'    <!-- @prop {string} adress Your Adress -->',
				'    test {{props.name}} {{props.adress}}',
				'  </button>',
				'</div>'
			].join('\n'),
			{ comments: true }
		).ast
		if (ast) {
			traverse(ast, doc, [propHandler], { functional: true, rootLeadingComment: [] })
			expect(doc.toObject().props).toMatchObject([
				{ name: 'name', type: { name: 'mixed' }, description: 'Your Name' },
				{ name: 'adress', type: { name: 'string' }, description: 'Your Adress' }
			])
			done()
		} else {
			done.fail()
		}
	})

	it('should not match props if in a string litteral', done => {
		const ast = compile(
			[
				'<div>',
				'  <h1>titleof the template</h1>',
				'  <button :style="`width:props.size`"></slot>',
				'</div>'
			].join('\n'),
			{ comments: true }
		).ast
		if (ast) {
			traverse(ast, doc, [propHandler], { functional: true, rootLeadingComment: [] })
			expect(doc.toObject().props).toBeUndefined()
			done()
		} else {
			done.fail()
		}
	})

	it('should not match props if in a non evaluated attribute', done => {
		const ast = compile(
			[
				'<div>',
				'  <h1>titleof the template</h1>',
				'  <button style="width:props.size"></slot>',
				'</div>'
			].join('\n'),
			{ comments: true }
		).ast
		if (ast) {
			traverse(ast, doc, [propHandler], { functional: true, rootLeadingComment: [] })
			expect(doc.toObject().props).toBeUndefined()
			done()
		} else {
			done.fail()
		}
	})

	it('should find props in object defined', done => {
		const ast = compile(
			[
				'<div>',
				'  <h1>titleof the template</h1>',
				'  <button :class="{',
				'	[$style.root]: true,',
				'	[$style.error]: props.error',
				'  }"></slot>',
				'</div>'
			].join('\n'),
			{ comments: true }
		).ast
		if (ast) {
			traverse(ast, doc, [propHandler], { functional: true, rootLeadingComment: [] })
			expect(doc.toObject().props).toMatchObject([{ name: 'error', type: {} }])
			done()
		} else {
			done.fail()
		}
	})

	/*
	
	*/
})
