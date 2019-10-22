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

	it('should return propB type as string', () => {
		expect(docButton.methods).toMatchObject([{ name: 'onClick' }])
	})

	it('should return slots definitions', () => {
		expect(docButton.slots).toMatchObject([
			{ name: 'default', description: 'Use this slot default' },
			{ name: 'empty', description: 'Use this slot for not button' }
		])
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
