import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'
import getTestDescriptor from '../../utils/getTestDescriptor'

const extReq = path.join(__dirname, './Component.vue')
let componentDoc: ComponentDoc

describe('tests with prop validation using variables', () => {
	beforeEach(async () => {
		componentDoc = await parse(extReq)
	})

	it('should have values for local variable', () => {
		expect(getTestDescriptor(componentDoc.props, 'firstProp').values).toEqual([1, 2, 3])
	})

	it('should have values for external named export variable', () => {
		expect(getTestDescriptor(componentDoc.props, 'secondProp').values).toEqual(['a', 'b', 'c'])
	})

	it('should have values for default export variable', () => {
		expect(getTestDescriptor(componentDoc.props, 'thirdProp').values).toEqual(['d', 'e', 'f'])
	})
})
