import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'
import getTestDescriptor from '../../utils/getTestDescriptor'

const extReq = path.join(__dirname, './external-require.vue')
let docExt: ComponentDoc

describe('tests when requiring an external js file', () => {
	beforeEach(async done => {
		docExt = await parse(extReq)
		done()
	})

	it('should return an object', () => {
		expect(typeof docExt).toEqual('object')
	})

	describe('props', () => {
		it('should have a test prop', () => {
			expect(getTestDescriptor(docExt.props, 'test').type).toBeDefined()
		})
	})
})
