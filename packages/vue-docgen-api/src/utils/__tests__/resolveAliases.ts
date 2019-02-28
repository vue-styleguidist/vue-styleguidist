import * as path from 'path'
import resolveAliases from '../resolveAliases'

describe('resolveAliases', () => {
  it('should resolve aliased from a path', () => {
    expect(
      resolveAliases('myPath/somethingNice/mixinFile.js', {
        myPath: './replacementPath/src/mixins',
      }),
    ).toEqual(path.join('./replacementPath/src/mixins', 'somethingNice/mixinFile.js'))
  })
})
