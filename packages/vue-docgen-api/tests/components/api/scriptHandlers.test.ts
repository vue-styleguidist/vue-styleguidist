import * as path from 'path'
import { parse, ScriptHandlers } from '../../../src/main'

describe('extending handlers', () => {
	it('should execute a custom script handler', async () => {
		const mockHandler = jest.fn().mockReturnValue(Promise.resolve())

		await parse(path.resolve(__dirname, 'mock.vue'), {
			addScriptHandlers: [mockHandler]
		})

		expect(mockHandler).toHaveBeenCalled()
	})

  it('should execute a custom script handler when scriptHandlers are specified', async () => {
		const mockHandler = jest.fn().mockReturnValue(Promise.resolve())

		await parse(path.resolve(__dirname, 'mock.vue'), {
      scriptHandlers: [ScriptHandlers.componentHandler],
			addScriptHandlers: [mockHandler]
		})

		expect(mockHandler).toHaveBeenCalled()
	})

	it('should execute a custom template handler', async () => {
    const mockHandler = jest.fn().mockReturnValue(Promise.resolve())

		await parse(path.resolve(__dirname, 'mock.vue'), {
			addTemplateHandlers: [mockHandler]
		})

		expect(mockHandler).toHaveBeenCalled()
	})
})
