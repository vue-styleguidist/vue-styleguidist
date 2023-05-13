import * as path from 'path'

import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'
import getTestDescriptor from '../../utils/getTestDescriptor'

const button = path.join(__dirname, './button.vue')
let docButton: ComponentDoc

describe('tests button', () => {
	beforeAll(async () => {
		docButton = await parse(button, {
			alias: {
				'@mixins': path.resolve(__dirname, '../../mixins')
			},
			modules: [path.resolve(__dirname, '../../mixins')]
		})
	})

	describe('props', () => {
		it('should match snapshot', () => {
			expect(getTestDescriptor(docButton.props, 'a').type).toMatchObject({
				name: 'string'
			})
		})
	})
})
