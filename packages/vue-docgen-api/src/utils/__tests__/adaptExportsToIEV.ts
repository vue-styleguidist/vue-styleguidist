import adaptRequireWithIEV from '../adaptExportsToIEV'
import { ImportedVariableSet } from '../resolveRequired'

jest.mock('../resolveImmediatelyExported')

describe('adaptRequireWithIEV', () => {
	let set: ImportedVariableSet
	let mockResolver: jest.Mock
	beforeEach(() => {
		set = { test: { filePath: ['my/path'], exportName: 'exportIt' } }
		mockResolver = jest.fn()
	})

	it('should call the resolver', async done => {
		await adaptRequireWithIEV(mockResolver, set, () => true)

		expect(mockResolver).toHaveBeenCalledWith('my/path')
		done()
	})

	it('should not resolve anything if multiple path in filePath', async done => {
		set.test.filePath.push('baz')
		await adaptRequireWithIEV(mockResolver, set, () => true)

		expect(mockResolver).not.toHaveBeenCalledWith()
		done()
	})
})
