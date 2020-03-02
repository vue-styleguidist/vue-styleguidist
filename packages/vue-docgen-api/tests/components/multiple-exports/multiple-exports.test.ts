import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse, parseMulti } from '../../../src/main'

const button = path.join(__dirname, './MyButton.vue')
let docButton: ComponentDoc[]
let buttonDoc: ComponentDoc
let inputDoc: ComponentDoc
describe('tests components with multiple exports', () => {
	beforeAll(async done => {
		docButton = await parseMulti(button)
		buttonDoc = docButton.find(d => d.exportName === 'Button') || {
			displayName: '<none>',
			exportName: '<none>'
		}

		inputDoc = docButton.find(d => d.exportName === 'Input') || {
			displayName: '<none>',
			exportName: '<none>'
		}
		done()
	})

	it('should have the correct content in the extracted definition', () => {
		expect(buttonDoc.description).toBe(
			'This is a button that represents a javascript only component, not a vue SFC'
		)
	})

	it('should export mixins prop', () => {
		expect(buttonDoc.props && buttonDoc.props.map(p => p.name)).toMatchInlineSnapshot(`
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

	it('should have contain the input definition', () => {
		expect(inputDoc.description).toBe(
			'This is an input that represents another component extracted in the same file'
		)
	})

	it('should match inline snapshot', () => {
		expect(docButton.map(c => c.exportName)).toMatchInlineSnapshot(`
		Array [
		  "default",
		  "Button",
		  "Input",
		]
	`)
	})
})

describe('possible multiple export in parse function', () => {
	it('should return default when using parse', async done => {
		const { exportName } = await parse(button)
		expect(exportName).toBe('default')
		done()
	})
})
