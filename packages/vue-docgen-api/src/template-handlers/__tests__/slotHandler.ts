import { compile } from 'vue-template-compiler'
import Documentation from '../../Documentation'
import { traverse } from '../../parse-template'
import slotHandler from '../slotHandler'

describe('slotHandler', () => {
	let doc: Documentation
	beforeEach(() => {
		doc = new Documentation('dummy/path')
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
				rootLeadingComment: ['@slot first slot found']
			})
			expect(doc.toObject().slots).toMatchObject([
				{ name: 'first', description: 'first slot found' }
			])
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
			traverse(ast, doc, [slotHandler], { functional: false, rootLeadingComment: [] })
			expect(doc.toObject().slots).toMatchObject([
				{ name: 'default', description: 'a default slot' }
			])
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
			traverse(ast, doc, [slotHandler], { functional: false, rootLeadingComment: [] })
			expect(doc.toObject().slots).toMatchObject([
				{
					name: 'oeuf',
					description: 'a slot named oeuf'
				}
			])
			done()
		} else {
			done.fail()
		}
	})

	describe('bindings', () => {
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
				traverse(ast, doc, [slotHandler], { functional: false, rootLeadingComment: [] })
				expect(doc.toObject().slots).toMatchObject([
					{
						name: 'oeuf',
						scoped: true,
						description: 'a slot named oeuf',
						bindings: [
							{
								name: 'item'
							}
						]
					}
				])
				done()
			} else {
				done.fail()
			}
		})

		it('should detect explicit bindings using v-bind', done => {
			const ast = compile(
				[
					'<div title="a list of item with a scope" >',
					'  <slot name="bound" v-for="item in items" v-bind="{ ...keyNames }"/>',
					'</div>'
				].join('\n'),
				{ comments: true }
			).ast
			if (ast) {
				traverse(ast, doc, [slotHandler], { functional: false, rootLeadingComment: [] })
				const slots = doc.toObject().slots || []
				expect(slots.filter(s => s.name === 'bound')[0].bindings).toMatchObject([
					{
						name: 'v-bind'
					}
				])
				done()
			} else {
				done.fail()
			}
		})

		it('should detect implicit bindings if it is simple enough', done => {
			const ast = compile(
				[
					'<div title="a list of item with a scope" >',
					'	<!-- @slot Menu Item footer -->',
					'	<slot name="bound" v-for="item in items" v-bind="{ item, otherItem: valueGiven }"/>',
					'</div>'
				].join('\n'),
				{ comments: true }
			).ast
			if (ast) {
				traverse(ast, doc, [slotHandler], { functional: false, rootLeadingComment: [] })
				const slots = doc.toObject().slots || []
				expect(slots.filter(s => s.name === 'bound')[0].bindings).toMatchObject([
					{
						name: 'item'
					},
					{
						name: 'otherItem'
					}
				])
				done()
			} else {
				done.fail()
			}
		})

		it('should detect explicit bindings and allow their documentation', done => {
			const ast = compile(
				[
					'<div title="a list of item with a scope" >',
					'	<!--',
					'		@slot Menu Item footer',
					'		@binding {object} item menu item',
					'		@binding {string} otherItem text of the menu item',
					'	-->',
					'  <slot name="bound" v-for="item in items" :item="item" :otherItem="valueGiven" />',
					'</div>'
				].join('\n'),
				{ comments: true }
			).ast
			if (ast) {
				traverse(ast, doc, [slotHandler], { functional: false, rootLeadingComment: [] })
				const slots = doc.toObject().slots || []
				expect(slots.filter(s => s.name === 'bound')[0].bindings).toMatchObject([
					{
						name: 'item',
						description: 'menu item'
					},
					{
						name: 'otherItem',
						description: 'text of the menu item'
					}
				])
				done()
			} else {
				done.fail()
			}
		})

		it('should not fail on non-dcumented slots', done => {
			const ast = compile(
				[
					'<div>', //
					'	<!-- test -->', //
					'  <slot />',
					'</div>'
				].join('\n'),
				{ comments: true }
			).ast
			if (ast) {
				traverse(ast, doc, [slotHandler], { functional: false, rootLeadingComment: [] })
				const slots = doc.toObject().slots || []
				expect(slots.length).toBe(1)
				done()
			} else {
				done.fail()
			}
		})

		it('should extract tags from a slot', done => {
			const ast = compile(
				[
					'<div>', //
					'	<!--',
					'		@slot',
					'		@ignore',
					'    -->', //
					'  <slot />',
					'</div>'
				].join('\n'),
				{ comments: true }
			).ast
			if (ast) {
				traverse(ast, doc, [slotHandler], { functional: false, rootLeadingComment: [] })
				const slots = doc.toObject().slots || []
				expect(slots[0].tags).toMatchInlineSnapshot(`
			Object {
			  "ignore": Array [
			    Object {
			      "description": true,
			      "title": "ignore",
			    },
			  ],
			}
		`)
				done()
			} else {
				done.fail()
			}
		})
	})
})
