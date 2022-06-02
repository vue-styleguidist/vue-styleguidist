import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'
import getTestDescriptor from '../../utils/getTestDescriptor'

const wrapper = path.join(__dirname, './Wrapper.vue')
let docWrapper: ComponentDoc

const app = path.join(__dirname, './App.vue')
let docApp: ComponentDoc

describe('tests wrapper with root slot', () => {
	describe('wrapper', () => {
		beforeEach(async () => {
			docWrapper = await parse(wrapper)
		})

		it('should have a slot.', () => {
			expect(docWrapper.slots && docWrapper.slots.length).toEqual(1)
		})

		it('should have a wrapper slot.', () => {
			expect(getTestDescriptor(docWrapper.slots, 'footer').description).toBe('Modal footer')
		})

		it('should show the slot as scoped', () => {
			expect(getTestDescriptor(docWrapper.slots, 'footer').scoped).toBeTruthy()
		})

		it('should match the reference for the footer slot', () => {
			expect(getTestDescriptor(docWrapper.slots, 'footer')).toMatchInlineSnapshot(`
				{
				  "bindings": [
				    {
				      "description": "an item passed to the footer",
				      "name": "item",
				      "title": "binding",
				      "type": {
				        "name": "mixed",
				      },
				    },
				  ],
				  "description": "Modal footer",
				  "name": "footer",
				  "scoped": true,
				}
			`)
		})
	})

	describe('app', () => {
		beforeEach(async () => {
			docApp = await parse(app)
		})

		it('should have a slot', () => {
			expect(docApp.slots && docApp.slots.length).toEqual(1)
		})

		it('should have a text slot', () => {
			expect(getTestDescriptor(docApp.slots, 'day').description).toBe(
				'for customizing individual days.'
			)
		})

		it('should match the reference for the text slot', () => {
			expect(getTestDescriptor(docApp.slots, 'day')).toMatchInlineSnapshot(`
				{
				  "bindings": [
				    {
				      "description": "The date instance of the day",
				      "name": "date",
				      "title": "binding",
				      "type": {
				        "name": "date",
				      },
				    },
				    {
				      "description": "The day number (e.g 21)",
				      "name": "day",
				      "title": "binding",
				      "type": {
				        "name": "number",
				      },
				    },
				    {
				      "description": "aria-label for the day",
				      "name": "aria-label",
				      "title": "binding",
				      "type": {
				        "name": "string",
				      },
				    },
				  ],
				  "description": "for customizing individual days.",
				  "name": "day",
				  "scoped": true,
				}
			`)
		})
	})
})
