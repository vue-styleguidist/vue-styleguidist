import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const button = path.join(__dirname, './InputWrapper.vue')
let docButton: ComponentDoc

describe('tests button functional', () => {
	beforeEach(async () => {
		docButton = await parse(button)
		// make sure all props are always in the same order
		docButton.props = docButton.props?.sort((p1, p2) => (p1.name < p2.name ? 1 : -1))
	})

	it('should extract props from template if functional', () => {
		expect(docButton.props).toContainEqual(
			expect.objectContaining({ name: 'error', type: { name: 'boolean' } })
		)
		expect(docButton.props).toContainEqual(
			expect.objectContaining({ name: 'value', type: { name: 'string' } })
		)
		expect(docButton.props).toContainEqual(
			expect.objectContaining({ name: 'label', type: { name: 'string' } })
		)
	})

	it('should match the snapshot', () => {
		expect(docButton).toMatchSnapshot()
	})
})
