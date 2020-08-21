import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'
import getTestDescriptor from '../../utils/getTestDescriptor'

const button = path.join(__dirname, './Button.vue')
let docButton: ComponentDoc
describe('tests button', () => {
	beforeAll(async () => {
		docButton = await parse(button)
	})

	it('should return an object', () => {
		expect(typeof docButton).toEqual('object')
	})

	it('should use the name in the decorator', () => {
		expect(docButton.displayName).toEqual('ClassButton')
	})

	it('should return methods object containing `onClick`', () => {
		expect(docButton.methods).toMatchObject([{ name: 'onClick' }])
	})

	describe('props', () => {
		it('should return propNoType type as string', () => {
			expect(getTestDescriptor(docButton.props, 'propNoType').type).toMatchObject({
				name: 'string'
			})
		})

		it('should return propA type as number', () => {
			expect(getTestDescriptor(docButton.props, 'propA').type).toMatchObject({ name: 'number' })
		})

		it('should return propB type as string', () => {
			expect(getTestDescriptor(docButton.props, 'propB').type).toMatchObject({ name: 'string' })
		})
	})

	it('should match the snapshot', () => {
		expect(docButton).toMatchSnapshot()
	})
})
