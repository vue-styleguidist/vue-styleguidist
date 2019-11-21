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
		beforeEach(async done => {
			docWrapper = await parse(wrapper)
			done()
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
			Object {
			  "bindings": Array [
			    Object {
			      "description": "an item passed to the footer",
			      "name": "item",
			      "title": "binding",
			      "type": Object {
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
		beforeEach(async done => {
			docApp = await parse(app)
			done()
		})

		it('should have a slot', () => {
			expect(docApp.slots && docApp.slots.length).toEqual(1)
		})

		it('should have a text slot', () => {
			expect(getTestDescriptor(docApp.slots, 'text').description).toBe('text slot here')
		})

		it('should match the reference for the text slot', () => {
			expect(getTestDescriptor(docApp.slots, 'text')).toMatchInlineSnapshot(`
									Object {
									  "description": "text slot here",
									  "name": "text",
									}
						`)
		})
	})
})
