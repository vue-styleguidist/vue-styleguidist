import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

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
			expect(Object.keys(docWrapper.slots).length).toEqual(1)
		})

		it('should have a wrapper slot.', () => {
			expect(docWrapper.slots.footer.description).toBe('Modal footer here')
		})

		it('should show the slot as scoped', () => {
			expect(docWrapper.slots.footer.scoped).toBeTruthy()
		})

		it('should match the reference for the footer slot', () => {
			expect(docWrapper.slots.footer).toMatchSnapshot()
		})
	})

	describe('app', () => {
		beforeEach(async done => {
			docApp = await parse(app)
			done()
		})

		it('should have a slot', () => {
			expect(Object.keys(docApp.slots).length).toEqual(1)
		})

		it('should have a text slot', () => {
			expect(docApp.slots.text.description).toBe('text slot here')
		})

		it('should match the reference for the text slot', () => {
			expect(docApp.slots.text).toMatchSnapshot()
		})
	})
})
