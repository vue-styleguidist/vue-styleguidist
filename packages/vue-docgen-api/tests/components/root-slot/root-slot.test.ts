import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'
import getTestDescriptor from '../../utils/getTestDescriptor'

const button = path.join(__dirname, './Wrapper.vue')
let docButton: ComponentDoc

describe('tests wrapper with root slot', () => {
	beforeEach(async () => {
		docButton = await parse(button)
	})

	it('should have a slot.', () => {
		expect(docButton.slots && docButton.slots.length).toEqual(1)
	})

	it('should have a wrapper slot.', () => {
		expect(getTestDescriptor(docButton.slots, 'wrapper').description).toBe('Use this slot default')
	})
})
