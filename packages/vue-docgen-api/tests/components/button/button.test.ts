import * as path from 'path'

import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'
import getTestDescriptor from '../../utils/getTestDescriptor'

const button = path.join(__dirname, './Button.vue')
let docButton: ComponentDoc

describe('tests button', () => {
	beforeAll(async done => {
		docButton = await parse(button, {
			'@mixins': path.resolve(__dirname, '../../mixins'),
			'@utils': path.resolve(__dirname, '../../utils')
		})
		// make sure all props are always in the same order
		docButton.props =
			docButton.props && docButton.props.sort((p1, p2) => (p1.name < p2.name ? 1 : -1))
		done()
	})

	it('should return an object', () => {
		expect(typeof docButton).toBe('object')
	})

	describe('general information', () => {
		it('The component name should be buttonComponent', () => {
			expect(docButton.displayName).toBe('Best Button')
		})

		it('The component should have a description', () => {
			expect(docButton.description).toBe(
				'This is an example of creating a reusable button component and using it with external data.'
			)
		})

		it('should the component has two tags', () => {
			expect(docButton.tags && Object.keys(docButton.tags).length).toBe(2)
		})

		it('should the component has authors', () => {
			expect(docButton.tags && docButton.tags.author).toMatchInlineSnapshot(`
									Array [
									  Object {
									    "description": "[Rafael](https://github.com/rafaesc92)",
									    "title": "author",
									  },
									]
						`)
		})

		it('should the component has version', () => {
			expect(docButton.tags && docButton.tags.version).toMatchInlineSnapshot(`
									Array [
									  Object {
									    "description": "1.0.5",
									    "title": "version",
									  },
									]
						`)
		})
	})

	it('should not see the method without tag @public', () => {
		expect(docButton.methods).toBeUndefined()
	})

	it('should have props', () => {
		expect(docButton.props).not.toBeUndefined()
	})

	describe('props', () => {
		it('should give the component a size prop with default value to "normal"', () => {
			expect(getTestDescriptor(docButton.props, 'size').defaultValue).toMatchObject({
				value: `'normal'`
			})
		})

		it('should the component has size prop description equal The size of the button', () => {
			expect(getTestDescriptor(docButton.props, 'size').description).toBe('The size of the button')
		})

		it('should give no origin to the native prop "span"', () => {
			expect(getTestDescriptor(docButton.props, 'span').mixin).toBeUndefined()
		})

		it('should have a prop "p1" from the mixin "namedMixin"', () => {
			expect(getTestDescriptor(docButton.props, 'p1').mixin).not.toBeUndefined()
			expect(getTestDescriptor(docButton.props, 'p1').mixin).toMatchInlineSnapshot(`
			Object {
			  "name": "namedMixin",
			  "path": "namedMixin.js",
			}
		`)
		})

		it('should give the size prop 3 valid values', () => {
			expect(getTestDescriptor(docButton.props, 'size').values).toEqual([
				'small',
				'medium',
				'large'
			])
		})

		it('should the component has color prop description equal The color for the button example', () => {
			expect(getTestDescriptor(docButton.props, 'color').description).toBe(
				'The color for the button example'
			)
		})

		it('should the component has color prop default equal #333', () => {
			expect(getTestDescriptor(docButton.props, 'color').defaultValue).toMatchObject({
				value: `'#333'`
			})
		})

		it('should the component has seventeen props', () => {
			expect(docButton.props && docButton.props.length).toBe(17)
		})

		it('should the component has propsAnother prop default equal "blue"', () => {
			expect(getTestDescriptor(docButton.props, 'propsAnother').defaultValue).toMatchObject({
				value: `'blue'`
			})
		})

		it('should span to be string|number', () => {
			expect(getTestDescriptor(docButton.props, 'span').type).toEqual({ name: 'string|number' })
		})

		it("should span has as description 'Number of columns (1-12) the column should span.'", () => {
			expect(getTestDescriptor(docButton.props, 'span').description).toBe(
				'Number of columns (1-12) the column should span.'
			)
		})

		it("should span has as description 'Sm breakpoint and above'", () => {
			expect(getTestDescriptor(docButton.props, 'spanSm').description).toBe(
				'Sm breakpoint and above'
			)
		})

		it("should spanMd has as description 'Md breakpoint and above'", () => {
			expect(getTestDescriptor(docButton.props, 'spanMd').description).toBe(
				'Md breakpoint and above'
			)
		})

		it('should spanSm to be string|number', () => {
			expect(getTestDescriptor(docButton.props, 'spanSm').type).toEqual({ name: 'string|number' })
		})

		it('should set funcDefault prop as a function (type "func")', () => {
			expect(getTestDescriptor(docButton.props, 'funcDefault').type).toEqual({ name: 'func' })
		})

		it('should prop1 to be string', () => {
			expect(getTestDescriptor(docButton.props, 'prop1').type).toMatchObject({ name: 'string' })
		})

		it('should example to be boolean', () => {
			expect(getTestDescriptor(docButton.props, 'example').type).toEqual({ name: 'boolean' })
		})

		it('should value default example to be false', () => {
			expect(getTestDescriptor(docButton.props, 'example').defaultValue).toMatchObject({
				value: 'false'
			})
		})

		it('should value default example props description to be The example props', () => {
			expect(getTestDescriptor(docButton.props, 'example').description).toBe('The example props')
		})

		it('should v-model to be string', () => {
			expect(getTestDescriptor(docButton.props, 'v-model').type).toEqual({ name: 'string' })
		})

		it('should value default v-model to be example model', () => {
			expect(getTestDescriptor(docButton.props, 'v-model').defaultValue).toMatchObject({
				value: `'example model'`
			})
		})

		it('should value default v-model props description to be Model example2', () => {
			expect(getTestDescriptor(docButton.props, 'v-model').description).toBe('Model example2')
		})

		it('should propE to be string', () => {
			expect(getTestDescriptor(docButton.props, 'propE').type).toEqual({ name: 'object' })
		})

		it('should value default propE to be a funtion', () => {
			const dv = getTestDescriptor(docButton.props, 'propE').defaultValue
			const functionNoSpaceNoReturn = dv ? dv.value.replace(/[ \n\r]/g, '') : ''
			expect(functionNoSpaceNoReturn).toEqual(`()=>{return{message:'hello'}}`)
			expect(dv ? dv.func : false).toBeTruthy()
		})

		it('should example3 to be number', () => {
			expect(getTestDescriptor(docButton.props, 'example3')).toMatchObject({
				type: { name: 'number' }
			})
		})

		it('should value default example3 to be 16', () => {
			expect(getTestDescriptor(docButton.props, 'example3').defaultValue).toMatchObject({
				value: '16'
			})
		})

		it('should value default example3 props description to be The example3 props', () => {
			expect(getTestDescriptor(docButton.props, 'example3').description).toEqual(
				'The example3 props'
			)
		})

		it('should onCustomClick to be ignored', () => {
			const tags = getTestDescriptor(docButton.props, 'onCustomClick').tags
			expect(tags && tags.ignore).toBeDefined()
		})

		it('should prop1 to be ignored', () => {
			const tags = getTestDescriptor(docButton.props, 'prop1').tags
			expect(tags && tags.ignore).toBeDefined()
		})

		it('should add multi mixins props', () => {
			expect(getTestDescriptor(docButton.props, 'shouldBe').type).toMatchObject({ name: 'string' })
		})

		it('should ignore multi mixins props that are not appended', () => {
			expect(getTestDescriptor(docButton.props, 'shouldNotBe').type).toBeUndefined()
		})
	})

	describe('events', () => {
		it('should the component has one event', () => {
			expect(docButton.events && docButton.events.length).toEqual(1)
		})

		it('should the component has event, it called success', () => {
			expect(getTestDescriptor(docButton.events, 'success').properties).toMatchInlineSnapshot(`
						Array [
						  Object {
						    "description": "example",
						    "name": "demo",
						    "type": Object {
						      "names": Array [
						        "object",
						      ],
						    },
						  },
						  Object {
						    "description": "test called",
						    "name": "called",
						    "type": Object {
						      "names": Array [
						        "number",
						      ],
						    },
						  },
						  Object {
						    "description": "Indicates whether the snowball is tightly packed.",
						    "name": "isPacked",
						    "type": Object {
						      "names": Array [
						        "boolean",
						      ],
						    },
						  },
						]
				`)
		})

		it('should the description of success event is Success event.', () => {
			expect(getTestDescriptor(docButton.events, 'success').description).toBe('Success event.')
		})
	})

	describe('slots', () => {
		it('should have a slot.', () => {
			expect(docButton.slots && docButton.slots.length).toBe(1)
		})

		it('should have a default slot.', () => {
			expect(docButton.slots && docButton.slots.find(s => s.name === 'default')).not.toBeUndefined()
		})

		it('the default slot should have "Use this slot default" as description', () => {
			expect(getTestDescriptor(docButton.slots, 'default').description).toBe(
				'Use this slot default'
			)
		})
	})

	it('should match the snapshot', () => {
		expect(docButton).toMatchSnapshot()
	})
})
