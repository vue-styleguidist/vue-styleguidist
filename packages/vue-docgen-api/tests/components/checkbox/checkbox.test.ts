import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const checkbox = path.join(__dirname, './Checkbox.vue')
let docCheckbox: ComponentDoc

describe('tests checkbox', () => {
	beforeEach(async () => {
		docCheckbox = await parse(checkbox)
	})

	it('should extract props from template', () => {
		expect(docCheckbox.props).toContainEqual(
			expect.objectContaining({ name: 'checked', type: { name: 'boolean' } })
		)
	})
})
