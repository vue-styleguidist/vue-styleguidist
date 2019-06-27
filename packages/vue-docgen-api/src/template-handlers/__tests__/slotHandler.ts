import { compile } from 'vue-template-compiler'
import { Documentation } from '../../Documentation'
import { traverse } from '../../parse-template'
import slotHandler from '../slotHandler'

describe('slotHandler', () => {
	let doc: Documentation
	beforeEach(() => {
		doc = new Documentation()
	})

	it('should pick comments at the beginning of templates', done => {
		const ast = compile(
			[
				'<slot name="first">',
				'  <div>',
				'    <h1>titleof the template</h1>',
				'  </div>',
				'</slot>'
			].join('\n'),
			{ comments: true }
		).ast
		if (ast) {
			traverse(ast, doc, [slotHandler], {
				functional: false,
				rootLeadingComment: '@slot first slot found'
			})
			expect(doc.toObject().slots.first).toMatchObject({ description: 'first slot found' })
			done()
		} else {
			done.fail()
		}
	})

	it('should pick comments before slots', done => {
		const ast = compile(
			[
				'<div>',
				'  <h1>titleof the template</h1>',
				'  <!-- @slot a default slot-->',
				'  <slot></slot>',
				'</div>'
			].join('\n'),
			{ comments: true }
		).ast
		if (ast) {
			traverse(ast, doc, [slotHandler], { functional: false, rootLeadingComment: '' })
			expect(doc.toObject().slots.default).toMatchObject({ description: 'a default slot' })
			done()
		} else {
			done.fail()
		}
	})

	it('should pick up the name of a slot', done => {
		const ast = compile(
			[
				'<div>',
				'  <h1>titleof the template</h1>',
				'  <!-- @slot a slot named oeuf -->',
				'  <slot name="oeuf"></slot>',
				'</div>'
			].join('\n'),
			{ comments: true }
		).ast
		if (ast) {
			traverse(ast, doc, [slotHandler], { functional: false, rootLeadingComment: '' })
			expect(doc.toObject().slots.oeuf).toMatchObject({ description: 'a slot named oeuf' })
			done()
		} else {
			done.fail()
		}
	})

	it('should detect scoped slots', done => {
		const ast = compile(
			[
				'<div title="a list of item with a scope" >',
				'  <!-- @slot a slot named oeuf -->',
				'  <slot name="oeuf" v-for="item in items" :item="item"/>',
				'</div>'
			].join('\n'),
			{ comments: true }
		).ast
		if (ast) {
			traverse(ast, doc, [slotHandler], { functional: false, rootLeadingComment: '' })
			expect(doc.toObject().slots.oeuf).toMatchObject({
				scoped: true,
				description: 'a slot named oeuf',
				bindings: {
					item: 'item'
				}
			})
			done()
		} else {
			done.fail()
		}
	})

	it('should detect implicit bindings', done => {
		const ast = compile(
			[
				'<div title="a list of item with a scope" >',
				'  <slot name="bound" v-for="item in items" v-bind="{ item: item }"/>',
				'</div>'
			].join('\n'),
			{ comments: true }
		).ast
		if (ast) {
			traverse(ast, doc, [slotHandler], { functional: false, rootLeadingComment: '' })
			const slots = doc.toObject().slots
			expect(slots.bound.bindings).toMatchObject({ 'v-bind': '{ item: item }' })
			done()
		} else {
			done.fail()
		}
	})
})
