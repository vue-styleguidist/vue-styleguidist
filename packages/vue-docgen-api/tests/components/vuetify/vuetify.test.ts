import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const field = path.join(__dirname, './VTextField.js')
let docField: ComponentDoc

describe('test a vuetify component', () => {
	beforeAll(async done => {
		docField = await parse(field)
		done()
	})

	it('should extract the export name', () => {
		expect(docField.exportName).toBe('default')
	})

	it('should has props', () => {
		expect(docField.props).not.toBeUndefined()
	})

	it('should match the snapshot', () => {
		expect(docField).toMatchSnapshot()
	})
})
