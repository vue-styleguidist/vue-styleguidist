import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'
import getTestDescriptor from '../../utils/getTestDescriptor'

const grid = path.join(__dirname, './Grid.vue')
let docGrid: ComponentDoc

describe('tests grid', () => {
	beforeEach(async () => {
		docGrid = await parse(grid)
	})

	it('should return an object', () => {
		expect(typeof docGrid).toBe('object')
	})

	it('The component name should be grid', () => {
		expect(docGrid.displayName).toEqual('grid')
	})

	it('should give the component authors', () => {
		expect(docGrid.tags && docGrid.tags.author).not.toBeUndefined()
	})

	it('should give the component a description', () => {
		expect(docGrid.description).not.toBeUndefined()
	})

	it('should have methods', () => {
		expect(docGrid.methods).not.toBeUndefined()
	})

	it('should return one param for this method', () => {
		const params = getTestDescriptor(docGrid.methods, 'sortBy').params
		expect(params && params.length).toEqual(1)
	})

	it('should return the correct object for this param', () => {
		expect(getTestDescriptor(docGrid.methods, 'sortBy').params).toMatchObject([
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
		expect(docGrid.tags && docGrid.tags.version).not.toBeUndefined()
	})

	describe('props', () => {
		it('should the component has four props', () => {
			expect((docGrid.props || []).length).toEqual(6)
		})

		it('grid component should have a msg prop as string|number type', () => {
			expect(getTestDescriptor(docGrid.props, 'msg').type).toMatchObject({
				name: 'string|number'
			})
		})

		it('grid component should have a filterKey prop as string type', () => {
			expect(getTestDescriptor(docGrid.props, 'filterKey').type).toMatchObject({ name: 'string' })
		})

		it('grid component should have a propFunc prop as func type', () => {
			expect(getTestDescriptor(docGrid.props, 'propFunc').type).toMatchObject({ name: 'func' })
		})

		it('grid component should have a images prop as Array type', () => {
			expect(getTestDescriptor(docGrid.props, 'images').type).toMatchObject({ name: 'array' })
		})

		it('grid component should have a data prop as Array type', () => {
			expect(getTestDescriptor(docGrid.props, 'data').type).toMatchObject({ name: 'array' })
		})

		it('grid component should have a columns prop as Array type', () => {
			expect(getTestDescriptor(docGrid.props, 'columns').type).toMatchObject({ name: 'array' })
		})
		it('should the prop msg has four tags', () => {
			expect(Object.keys(getTestDescriptor(docGrid.props, 'msg').tags || {}).length).toEqual(4)
		})
	})

	it('should the component has two event', () => {
		expect((docGrid.events || []).length).toEqual(2)
	})

	it('should the description of success event is Success event.', () => {
		expect(getTestDescriptor(docGrid.events, 'success').description).toEqual('Success event.')
	})

	it('should the description of error event is Error event.', () => {
		expect(getTestDescriptor(docGrid.events, 'error').description).toEqual('Error event.')
	})

	it('should make the type of error event an object.', () => {
		expect(getTestDescriptor(docGrid.events, 'error')).toMatchObject({
			type: { names: ['object'] }
		})
	})

	it('should have two slots.', () => {
		expect((docGrid.slots || []).length).toEqual(2)
	})

	it('the header slot should have "Use this slot header" as description', () => {
		expect(getTestDescriptor(docGrid.slots, 'header').description).toEqual('Use this slot header')
	})

	it('the footer slot should have "Use this slot footer" as description', () => {
		expect(getTestDescriptor(docGrid.slots, 'footer').description).toEqual('Use this slot footer')
	})

	it('should match the snapshot', () => {
		expect(docGrid).toMatchSnapshot()
	})
})
