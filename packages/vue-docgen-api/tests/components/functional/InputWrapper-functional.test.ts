import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const button = path.join(__dirname, './InputWrapper.vue')
let docButton: ComponentDoc

describe('tests button functional', () => {
	beforeEach(async done => {
		docButton = await parse(button)
		done()
	})

	it('should extract props from template if functional', () => {
		expect(docButton.props).toContainEqual(
			expect.objectContaining({ name: 'error', type: { name: 'boolean' } })
		)
		expect(docButton.props).toContainEqual(
			expect.objectContaining({ name: 'v-model', type: { name: 'string' } })
		)
		expect(docButton.props).toContainEqual(
			expect.objectContaining({ name: 'label', type: { name: 'string' } })
		)
	})

	it('should not return the value props as it is v-model', () => {
		expect(docButton.props).not.toMatchObject([{ name: 'value', type: { name: 'string' } }])
	})

	it('should match the snapshot', () => {
		expect(docButton).toMatchSnapshot()
	})
})
