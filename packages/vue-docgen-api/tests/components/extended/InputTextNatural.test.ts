import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const InputText = path.join(__dirname, './InputTextNatural.js')
let docInputText: ComponentDoc

describe('tests InputText as a JS file', () => {
	beforeAll(async done => {
		docInputText = await parse(InputText)
		done()
	})

	it('should return an object', () => {
		expect(typeof docInputText).toBe('object')
	})

	it('The component name should be InputText', () => {
		expect(docInputText.displayName).toEqual('InputText')
	})

	it('The component should has a description', () => {
		expect(docInputText.description).toEqual('Description InputText')
	})

	it('should has props', () => {
		expect(docInputText.props).not.toBeUndefined()
	})

	it('should the component has two props', () => {
		expect(docInputText.props && docInputText.props.length).toEqual(2)
	})

	it('should match the snapshot', () => {
		expect(docInputText).toMatchSnapshot()
	})
})
