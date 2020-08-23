import recursiveResolveIEV from '../recursiveResolveIEV'
import { ImportedVariableSet } from '../resolveRequired'

jest.mock('../resolveImmediatelyExported')

describe('recursiveResolveIEV', () => {
	let set: ImportedVariableSet
	let mockResolver: jest.Mock
	beforeEach(() => {
		set = { test: { filePath: ['my/path'], exportName: 'exportIt' } }
		mockResolver = jest.fn()
	})

	it('should call the resolver', async () => {
		await recursiveResolveIEV(mockResolver, set, () => true)

		expect(mockResolver).toHaveBeenCalledWith('my/path')
	})

	it('should not resolve anything if multiple path in filePath', async () => {
		set.test.filePath.push('baz')
		await recursiveResolveIEV(mockResolver, set, () => true)

		expect(mockResolver).not.toHaveBeenCalledWith()
	})
})
