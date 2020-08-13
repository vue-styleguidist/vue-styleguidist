import * as path from 'path'
import { parse } from '../../../src/main'

describe('extending handlers', () => {
	it('should execute a custom script handler', async () => {
		let hasRun = false

		await parse(path.resolve(__dirname, 'mock.vue'), {
			addScriptHandlers: [
				async function handler() {
					hasRun = true
				}
			]
		})

		expect(hasRun).toBe(true)
	})

	it('should execute a custom template handler', async () => {
		let hasRun = false

		await parse(path.resolve(__dirname, 'mock.vue'), {
			addTemplateHandlers: [
				async function handler() {
					hasRun = true
				}
			]
		})

		expect(hasRun).toBe(true)
	})
})
