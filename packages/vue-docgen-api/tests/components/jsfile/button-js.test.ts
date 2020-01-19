import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parseMulti, parse } from '../../../src/main'

const button = path.join(__dirname, './MyButton.js')
let docButton: ComponentDoc[]
describe('tests button with pure javascript', () => {
	beforeAll(async done => {
		docButton = await parseMulti(button)
		done()
	})

	it('should extract the export name', () => {
		expect(docButton[0].exportName).toBe('Button')
	})

	it('should have the correct content in the extracted definition', () => {
		expect(docButton[0].description).toBe(
			'This is a button that represents a javascript only component, not a vue SFC'
		)
	})

	it('should export mixins prop', () => {
		expect(docButton[0].props && docButton[0].props.map(p => p.name)).toMatchInlineSnapshot(`
		Array [
		  "color",
		  "id",
		  "v-model",
		  "falseValue",
		  "trueValue",
		  "multiple",
		  "label",
		  "as",
		  "type",
		  "variant",
		  "variantColor",
		  "size",
		  "isDisabled",
		]
	`)
	})

	it('should extract the export name for input', () => {
		expect(docButton[1].exportName).toBe('Input')
	})

	it('should have contain the input definition', () => {
		expect(docButton[1].description).toBe(
			'This is an input that represents another component extracted in the same file'
		)
	})
})

describe('possible multiple export in parse function', () => {
	it('should return Button when using parse', async done => {
		const { exportName } = await parse(button)
		expect(exportName).toBe('Button')
		done()
	})
})
