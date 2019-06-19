import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const button = path.join(__dirname, './InputWrapper.vue')
let docButton: ComponentDoc

describe('tests button functional', () => {
	beforeEach(done => {
		docButton = parse(button)
		done()
	})

	it('should extract props from template if functional', () => {
		expect(docButton.props).toMatchObject({
			error: { type: { name: 'boolean' } },
			label: { type: { name: 'string' } }
		})
	})

	it('should match the snapshot', () => {
		expect(docButton).toMatchSnapshot()
	})
})
