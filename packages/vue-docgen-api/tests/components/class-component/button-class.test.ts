import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'
import getTestDescriptor from '../../utils/getTestDescriptor'

const button = path.join(__dirname, './Button.vue')
let docButton: ComponentDoc
describe('tests button', () => {
	beforeAll(async done => {
		docButton = await parse(button)
		done()
	})

	it('should return an object', () => {
		expect(typeof docButton).toEqual('object')
	})

	it('should use the name in the decorator', () => {
		expect(docButton.displayName).toEqual('ClassComponent')
	})

	it('should return propB type as string', () => {
		expect(docButton.methods).toMatchObject([{ name: 'onClick' }])
	})

	describe('props', () => {
		it('should return prop bundleHash from component', () => {
			expect(getTestDescriptor(docButton.props, 'bundleHash').type).toMatchObject({
				name: 'number'
			})
		})

		it('should return prop color from mixin', () => {
			expect(getTestDescriptor(docButton.props, 'color')).toMatchObject({
				type: { name: 'string' },
				description: 'color of the button'
			})
		})
	})

	it('should match the snapshot', () => {
		expect(docButton).toMatchSnapshot()
	})
})
