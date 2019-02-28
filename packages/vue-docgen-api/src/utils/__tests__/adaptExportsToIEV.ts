import adaptRequireWithIEV from '../adaptExportsToIEV'
import { ImportedVariableSet } from '../resolveRequired'

jest.mock('../resolveImmediatelyExported')

describe('adaptRequireWithIEV', () => {
  let set: ImportedVariableSet
  let mockResolver: jest.Mock
  beforeEach(() => {
    set = { test: { filePath: 'my/path', exportName: 'exportIt' } }
    mockResolver = jest.fn()
  })

  it('should call the resolver', () => {
    adaptRequireWithIEV(mockResolver, set)

    expect(mockResolver).toHaveBeenCalledWith('my/path')
  })
})
