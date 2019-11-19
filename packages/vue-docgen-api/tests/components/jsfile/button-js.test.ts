import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const button = path.join(__dirname, './MyButton.js')
let docButton: ComponentDoc
describe('tests button with pug', () => {
	beforeAll(async done => {
		docButton = await parse(button, { nameFilter: 'Button' })
		done()
	})

	it('should extract the export name', () => {
		expect(docButton.exportName).toBe('Button')
	})

	it('should have the correct content in the extracted definition', () => {
		expect(docButton.description).toBe('This is a button that represents a javascript only component, not a vue SFC')
	})
})
