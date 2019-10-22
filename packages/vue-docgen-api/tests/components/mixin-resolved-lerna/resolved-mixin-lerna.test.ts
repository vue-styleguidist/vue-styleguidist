import * as path from 'path'

import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'
import getTestDescriptor from '../../utils/getTestDescriptor'

const button = path.join(__dirname, './button.vue')
let docButton: ComponentDoc

describe('tests button', () => {
	beforeAll(async done => {
		docButton = await parse(button)
		done()
	})

	describe('props', () => {
		it('should return the "color" prop description from passthrough exported mixin', () => {
			expect(getTestDescriptor(docButton.props, 'color').description).toEqual('Example prop')
		})
	})
})
