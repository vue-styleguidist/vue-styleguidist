import * as path from 'path'

import { ComponentDoc, PropDescriptor } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const button = path.join(__dirname, './button.vue')
let docButton: ComponentDoc

describe('tests button', () => {
	beforeAll(async done => {
		docButton = await parse(button)
		done()
	})

	describe('props', () => {
		let props: { [propName: string]: PropDescriptor }

		beforeAll(() => {
			props = docButton.props ? docButton.props : {}
		})

		it('should return the "color" prop description from passthrough exported mixin', () => {
			expect(props.color.description).toEqual('Example prop')
		})
	})
})
