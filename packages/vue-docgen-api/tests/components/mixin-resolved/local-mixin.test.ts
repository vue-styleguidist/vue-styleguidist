import * as path from 'path'

import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const button = path.join(__dirname, './button.js')
let docButton: ComponentDoc

describe('tests button', () => {
	beforeAll(async () => {
		docButton = await parse(button)
	})

	it('should parse some propps from the mixin', () => {
		expect(docButton.props).toHaveLength(2)
	})
})
