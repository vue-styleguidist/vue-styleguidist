import * as path from 'path'

import { ComponentDoc } from '../../../src/Documentation'
import { parse, PropDescriptor } from '../../../src/main'

const button = path.join(__dirname, './Button.vue')
let docButton: ComponentDoc

describe('tests button', () => {
	let sizeProp: PropDescriptor = { name: '<default>' }
	beforeAll(async done => {
		docButton = await parse(button, {
			alias: {
				'@mixins': path.resolve(__dirname, '../../mixins'),
				'@utils': path.resolve(__dirname, '../../utils')
			},
			translation: 'FR'
		})
		done()

		sizeProp = (docButton.props && docButton.props.find(p => p.name === 'size')) || sizeProp
	})

	it('should return an object', () => {
		expect(typeof docButton).toBe('object')
	})

	describe('props', () => {
		it('The prop description should be translated', () => {
			expect(sizeProp.description).toBe('taille du bouton')
		})
	})
})
