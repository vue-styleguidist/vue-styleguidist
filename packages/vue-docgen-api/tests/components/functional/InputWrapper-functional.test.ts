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
			label: { type: { name: 'string' } },
			'v-model': { type: { name: 'string' } }
		})
	})

	it('should not return the value props as it is v-model', () => {
		expect(docButton.props).not.toMatchObject({
			value: { type: { name: 'string' } }
		})
	})

	it('should match the snapshot', () => {
		expect(docButton).toMatchSnapshot()
	})
})
