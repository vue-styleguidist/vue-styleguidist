import { parse } from '@vue/compiler-dom'
import Documentation from '../../Documentation'
import { traverse } from '../../parse-template'
import slotHandler from '../slotHandler'

describe('slotHandler', () => {
	let doc: Documentation
	beforeEach(() => {
		doc = new Documentation('dummy/path')
	})

	it('should detect slots', () => {
		const ast = parse(
			[
				'<div>',
				'  <h1>titleof the template</h1>',
				'  <!-- @slot a default slot-->',
				'  <slot></slot>',
				'</div>'
			].join('\n')
		)
		traverse(ast.children[0], doc, [slotHandler], ast.children, { functional: false })
		expect(doc.toObject().slots).toMatchObject([{ name: 'default', description: 'a default slot' }])
	})

	it('should pick comments at the beginning of templates', () => {
		const ast = parse(
			[
				'<!-- @slot first slot found -->',
				'<slot name="first">',
				'  <div>',
				'    <h1>titleof the template</h1>',
				'  </div>',
				'</slot>'
			].join('\n')
		)

		traverse(ast.children[1], doc, [slotHandler], ast.children, {
			functional: false
		})
		expect(doc.toObject().slots).toMatchObject([{ name: 'first', description: 'first slot found' }])
	})

	it('should pick up the name of a slot', () => {
		const ast = parse(
			[
				'<div>',
				'  <h1>titleof the template</h1>',
				'  <!-- @slot a slot named oeuf -->',
				'  <slot name="oeuf"></slot>',
				'</div>'
			].join('\n')
		)
		traverse(ast.children[0], doc, [slotHandler], ast.children, { functional: false })
		expect(doc.toObject().slots).toMatchObject([
			{
				name: 'oeuf',
				description: 'a slot named oeuf'
			}
		])
	})

	describe('bindings', () => {
		it('should detect scoped slots', () => {
			const ast = parse(
				[
					'<div title="a list of item with a scope" >',
					'  <!-- @slot a slot named oeuf -->',
					'  <slot name="oeuf" v-for="item in items" :item="itemValue"/>',
					'</div>'
				].join('\n')
			)
			traverse(ast.children[0], doc, [slotHandler], ast.children, { functional: false })
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
		})

		it('should detect explicit bindings using v-bind', () => {
			const ast = parse(
				[
					'<div title="a list of item with a scope" >',
					'  <slot name="bound" v-for="item in items" v-bind="{ ...keyNames }"/>',
					'</div>'
				].join('\n')
			)
			traverse(ast.children[0], doc, [slotHandler], ast.children, { functional: false })
			const slots = doc.toObject().slots || []
			expect(slots.filter(s => s.name === 'bound')[0].bindings).toMatchObject([
				{
					name: 'v-bind'
				}
			])
		})

		it('should detect implicit bindings if it is simple enough', () => {
			const ast = parse(
				[
					'<div title="a list of item with a scope" >',
					'	<!-- @slot Menu Item footer -->',
					'	<slot name="bound" v-for="item in items" v-bind="{ item, otherItem: valueGiven }"/>',
					'</div>'
				].join('\n')
			)
			traverse(ast.children[0], doc, [slotHandler], ast.children, { functional: false })
			const slots = doc.toObject().slots || []
			expect(slots.filter(s => s.name === 'bound')[0].bindings).toMatchObject([
				{
					name: 'item'
				},
				{
					name: 'otherItem'
				}
			])
		})

		it('should detect explicit bindings and allow their documentation', () => {
			const ast = parse(
				[
					'<div title="a list of item with a scope" >',
					'	<!--',
					'		@slot Menu Item footer',
					'		@binding {object} item menu item',
					'		@binding {string} otherItem text of the menu item',
					'	-->',
					'  <slot name="bound" v-for="item in items" :item="item" :otherItem="valueGiven" />',
					'</div>'
				].join('\n')
			)
			traverse(ast.children[0], doc, [slotHandler], ast.children, { functional: false })
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
		})

		it('should not fail on slots', () => {
			const ast = parse(
				[
					'<div>', //
					'  <!-- test -->', //
					'  <slot />',
					'</div>'
				].join('\n')
			)
			traverse(ast.children[0], doc, [slotHandler], ast.children, { functional: false })
			const slots = doc.toObject().slots || []
			expect(slots.length).toBe(1)
		})

		it('should not fail on non-commented slots', () => {
			const ast = parse(
				[
					'<div>', //
					'  <slot />',
					'</div>'
				].join('\n')
			)
			traverse(ast.children[0], doc, [slotHandler], ast.children, { functional: false })
			const slots = doc.toObject().slots || []
			expect(slots.length).toBe(1)
		})

		it('should extract tags from a slot', () => {
			const ast = parse(
				[
					'<div>', //
					'	<!--',
					'		@slot',
					'		@ignore',
					'    -->', //
					'  <slot />',
					'</div>'
				].join('\n')
			)
			traverse(ast.children[0], doc, [slotHandler], ast.children, { functional: false })
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
		})
	})
})
