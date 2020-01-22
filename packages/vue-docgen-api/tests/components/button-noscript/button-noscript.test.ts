import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'
import getTestDescriptor from '../../utils/getTestDescriptor'

const button = path.join(__dirname, './MyButton.vue')
let docButton: ComponentDoc

describe('tests button with no script block', () => {
	beforeEach(async done => {
		docButton = await parse(button)
		done()
	})

	it('should have a slot.', () => {
		expect(docButton.slots && docButton.slots.length).toEqual(1)
	})

	it('the default slot should have "Use this slot default" as description', () => {
		expect(getTestDescriptor(docButton.slots, 'default').description).toEqual(
			'Use this slot default'
		)
	})

	it('the onclick event should have "trigered on click" as description', () => {
		expect(getTestDescriptor(docButton.events, 'click').description).toEqual('trigered on click')
	})

	it('should match the snapshot', () => {
		expect(docButton).toMatchSnapshot()
	})
})
