import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const button = path.join(__dirname, './DatePicker.vue')
let docButton: ComponentDoc
describe('tests datePicker', () => {
	beforeAll(async () => {
		docButton = await parse(button, { jsx: false })
	})

	it('should return an object', () => {
		expect(typeof docButton).toEqual('object')
	})

	it('should use the name in the decorator', () => {
		expect(docButton.displayName).toEqual('DatePicker')
	})

	it('should match the snapshot', () => {
		expect(docButton).toMatchSnapshot()
	})
})
