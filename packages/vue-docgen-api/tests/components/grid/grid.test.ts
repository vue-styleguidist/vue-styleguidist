import * as path from 'path'
import { ComponentDoc, PropDescriptor } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const grid = path.join(__dirname, './Grid.vue')
let docGrid: ComponentDoc

describe('tests grid', () => {
	beforeEach(async done => {
		docGrid = await parse(grid)
		done()
	})

	it('should return an object', () => {
		expect(typeof docGrid).toBe('object')
	})

	it('The component name should be grid', () => {
		expect(docGrid.displayName).toEqual('grid')
	})

	it('should the component has tags', () => {
		expect(typeof docGrid.tags !== 'undefined').toBe(true)
	})

	it('should the component has authors', () => {
		expect(typeof docGrid.tags.author !== 'undefined').toBe(true)
	})

	it('should the component has description', () => {
		expect(typeof docGrid.description !== 'undefined').toBe(true)
	})

	it('should has methods', () => {
		expect(typeof docGrid.methods !== 'undefined').toBe(true)
	})

	it('should return one method for the component', () => {
		expect(docGrid.methods.length).toEqual(1)
	})

	it('should return one param for this method', () => {
		const params = docGrid.methods[0].params
		expect(params !== undefined ? params.length : 0).toEqual(1)
	})

	it('should return the correct object for this param', () => {
		expect(docGrid.methods[0].params).toMatchObject([
			{
				name: 'key',
				description: 'Key to order'
			}
		])
	})

	it('should has props', () => {
		expect(docGrid.props).not.toBeUndefined()
	})

	it('should the component has version', () => {
		expect(docGrid.tags.version).not.toBeUndefined()
	})

	describe('props', () => {
		let props: { [propName: string]: PropDescriptor }

		beforeAll(() => {
			props = docGrid.props ? docGrid.props : {}
		})
		it('should the component has four props', () => {
			expect(Object.keys(props).length).toEqual(6)
		})

		it('grid component should have a msg prop as string|number type', () => {
			expect(props.msg.type).toMatchObject({ name: 'string|number' })
		})

		it('grid component should have a filterKey prop as string type', () => {
			expect(props.filterKey.type).toMatchObject({ name: 'string' })
		})

		it('grid component should have a propFunc prop as func type', () => {
			expect(props.propFunc.type).toMatchObject({ name: 'func' })
		})

		it('grid component should have a images prop as Array type', () => {
			expect(props.images.type).toMatchObject({ name: 'array' })
		})

		it('grid component should have a data prop as Array type', () => {
			expect(props.data.type).toMatchObject({ name: 'array' })
		})

		it('grid component should have a columns prop as Array type', () => {
			expect(props.columns.type).toMatchObject({ name: 'array' })
		})
		it('should the prop msg has four tags', () => {
			expect(Object.keys(props.msg.tags).length).toEqual(4)
		})
	})

	it('should the component has two event', () => {
		expect(Object.keys(docGrid.events || {}).length).toEqual(2)
	})

	it('should the component has event, it called success', () => {
		expect((docGrid.events || {}).success).not.toBeUndefined()
	})

	it('should the description of success event is Success event.', () => {
		expect((docGrid.events || {}).success.description).toEqual('Success event.')
	})

	it('should the component has event, it called error', () => {
		expect((docGrid.events || {}).error).not.toBeUndefined()
	})

	it('should the description of error event is Error event.', () => {
		expect((docGrid.events || {}).error.description).toEqual('Error event.')
	})

	it('should make the type of error event an object.', () => {
		expect((docGrid.events || {}).error).toMatchObject({ type: { names: ['object'] } })
	})

	it('should have two slots.', () => {
		expect(Object.keys(docGrid.slots).length).toEqual(2)
	})

	it('should have a slot named header.', () => {
		expect(typeof docGrid.slots.header !== 'undefined').toBe(true)
	})

	it('the header slot should have "Use this slot header" as description', () => {
		expect(docGrid.slots.header.description).toEqual('Use this slot header')
	})

	it('should have a slot named footer.', () => {
		expect(typeof docGrid.slots.footer !== 'undefined').toBe(true)
	})

	it('the footer slot should have "Use this slot footer" as description', () => {
		expect(docGrid.slots.footer.description).toEqual('Use this slot footer')
	})

	it('should match the snapshot', () => {
		expect(docGrid).toMatchSnapshot()
	})
})
