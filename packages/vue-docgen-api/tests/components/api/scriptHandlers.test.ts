import { vi } from 'vitest'
import * as path from 'path'
import { parse } from '../../../src/main'

describe('extending handlers', () => {
	it('should execute a custom script handler', async () => {
		const scriptHandler = vi.fn().mockResolvedValue(Promise.resolve())

    const p = path.resolve(__dirname, 'mock.vue')

		await parse(p, {
			addScriptHandlers: [
				scriptHandler
			]
		})

		expect(scriptHandler).toHaveBeenCalled()
	})

	it('should execute a custom template handler', async () => {
		let hasRun = false

		await parse(path.resolve(__dirname, 'mock.vue'), {
			addTemplateHandlers: [
				function handler() {
					hasRun = true
					return Promise.resolve()
				}
			]
		})

		expect(hasRun).toBe(true)
	})
})
