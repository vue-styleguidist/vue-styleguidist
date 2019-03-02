import * as path from 'path'
import { ComponentDoc, PropDescriptor } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const grid = path.join(__dirname, './Grid.vue')
let docGrid: ComponentDoc

describe('tests grid jsx', () => {
	beforeAll(done => {
		docGrid = parse(grid)
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

	it('should the component has one method', () => {
		expect(Object.keys(docGrid.methods).length).toEqual(1)
	})

	it('should has props', () => {
		expect(docGrid.props).not.toBeUndefined()
	})

	it('should the component has version', () => {
		expect(typeof docGrid.tags.version !== 'undefined').toBe(true)
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
		expect(typeof (docGrid.events || {}).success !== 'undefined').toBe(true)
	})

	it('should the description of success event is Success event.', () => {
		expect((docGrid.events || {}).success.description).toEqual('Success event.')
	})

	it('should the component has event, it called error', () => {
		expect(typeof (docGrid.events || {}).error !== 'undefined').toBe(true)
	})

	it('should the description of error event is Error event.', () => {
		expect((docGrid.events || {}).error.description).toEqual('Error event.')
	})

	it('should define the return type of the first method', () => {
		expect(docGrid.methods[0].returns).toMatchObject({ description: 'Test' })
	})

	it('should return slots from the render method', () => {
		expect(docGrid.slots.header).toMatchObject({ description: 'Use this slot header' })
	})

	it('should match the snapshot', () => {
		expect(docGrid).toMatchSnapshot()
	})
})
