import * as path from 'path'

import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const button = path.join(__dirname, './Button.vue')
let docButton: ComponentDoc

describe('tests button', () => {
	beforeAll(async done => {
		docButton = await parse(button, {
			alias: {
				'@mixins': path.resolve(__dirname, '../../mixins'),
				'@utils': path.resolve(__dirname, '../../utils')
			},
			lang: 'FR'
		})
		done()
	})

	it('should return an object', () => {
		expect(typeof docButton).toBe('object')
	})

	describe('props', () => {
		it('The prop name should be translated', () => {
			expect(docButton.props && docButton.props.find(p => p.name === 'size')).toBe(
				'taille du bouton'
			)
		})
	})
})
