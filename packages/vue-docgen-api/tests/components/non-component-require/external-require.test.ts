import * as path from 'path'
import { ComponentDoc, PropDescriptor } from '../../../src/Documentation'
import { parse } from '../../../src/main'

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
		let props: { [propName: string]: PropDescriptor }

		beforeAll(() => {
			props = docExt.props ? docExt.props : {}
		})

		it('should have at least one prop', () => {
			expect(Object.keys(props).length).toEqual(1)
		})

		it('should have a test prop', () => {
			expect(props.test).toBeDefined()
		})
	})
})
