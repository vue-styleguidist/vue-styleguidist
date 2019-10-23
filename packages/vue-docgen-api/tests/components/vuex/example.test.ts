import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'
import getTestDescriptor from '../../utils/getTestDescriptor'

const exampleVuex = path.join(__dirname, './example.vue')
let docVuex: ComponentDoc

describe('test example vuex', () => {
	beforeAll(async done => {
		docVuex = await parse(exampleVuex)
		done()
	})

	it('should return an object', () => {
		expect(typeof docVuex).toBe('object')
	})

	it('The component name should be example', () => {
		expect(docVuex.displayName).toEqual('example')
	})

	it('The component should has a description', () => {
		expect(docVuex.description).toEqual('Partial mapping, object spread operator example')
	})

	it('should have "submit" method', () => {
		expect(getTestDescriptor(docVuex.methods, 'onSubmit').name).toBe('onSubmit')
	})

	it('should dont have slots.', () => {
		expect(docVuex.slots && docVuex.slots.length).toEqual(0)
	})

	it('should match the snapshot', () => {
		expect(docVuex).toMatchSnapshot()
	})
})
