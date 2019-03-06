import { compile } from 'vue-template-compiler'
import { Documentation } from '../../Documentation'
import { traverse } from '../../parse-template'
import propHandler from '../propHandler'

describe('slotHandler', () => {
	let doc: Documentation
	beforeEach(() => {
		doc = new Documentation()
	})

	it('should match props in attributes expressions', () => {
		const ast = compile(
			[
				'<div>',
				'  <h1>titleof the template</h1>',
				'  <!-- @prop {number} size width of the button -->',
				'  <!-- @prop {string} value value in the form -->',
				'  <button :style="`width:${props.size}`" :value="props.value"></button>',
				'</div>'
			].join('\n'),
			{ comments: true }
		).ast
		if (ast) {
			traverse(ast, doc, [propHandler], { functional: true, rootLeadingComment: '' })
			expect(doc.toObject().props).toMatchObject({
				size: { type: { name: 'number' }, description: 'width of the button' },
				value: { type: { name: 'string' }, description: 'value in the form' }
			})
		} else {
			fail()
		}
	})

	it('should match props in interpolated text', () => {
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
			traverse(ast, doc, [propHandler], { functional: true, rootLeadingComment: '' })
			expect(doc.toObject().props).toMatchObject({
				name: { type: { name: 'mixed' }, description: 'Your Name' },
				adress: { type: { name: 'string' }, description: 'Your Adress' }
			})
		} else {
			fail()
		}
	})

	it('should not match props if in a string litteral', () => {
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
			traverse(ast, doc, [propHandler], { functional: true, rootLeadingComment: '' })
			expect(doc.toObject().props).toBeUndefined()
		} else {
			fail()
		}
	})

	it('should not match props if in a non evaluated attribute', () => {
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
			traverse(ast, doc, [propHandler], { functional: true, rootLeadingComment: '' })
			expect(doc.toObject().props).toBeUndefined()
		} else {
			fail()
		}
	})
})
