import { SpyInstance } from 'vitest'
import recursiveResolveIEV from '../recursiveResolveIEV'
import { ImportedVariableSet } from '../resolveRequired'

vi.mock('../resolveImmediatelyExported')

describe('recursiveResolveIEV', () => {
	let set: ImportedVariableSet
	let mockResolver: SpyInstance<[string, string | undefined], string | null>
	beforeEach(() => {
		set = { test: { filePath: ['my/path'], exportName: 'exportIt' } }
		mockResolver = vi.fn()
	})

	it('should call the resolver', async () => {
    const imp = mockResolver.getMockImplementation()
    if(imp){
      await recursiveResolveIEV(imp, set, () => true)
    }

		expect(mockResolver).toHaveBeenCalledWith('my/path')
	})

	it('should not resolve anything if multiple path in filePath', async () => {
		set.test.filePath.push('baz')
    const imp = mockResolver.getMockImplementation()
    if(imp){
		  await recursiveResolveIEV(imp, set, () => true)
    }

		expect(mockResolver).not.toHaveBeenCalledWith()
	})
})
