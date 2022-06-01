import * as path from 'path'
import resolveAliases from '../resolveAliases'

vi.doMock('fs', () => {
	return {
		existsSync: jest.fn((path: string) =>
			path === '/replacementPath/src/mixins/somethingNice/mixinFile.js'
		)
	}
})

describe('resolveAliases', () => {
	it('should resolve aliased from a path', () => {
		expect(
			resolveAliases('myPath/somethingNice/mixinFile.js', {
				myPath: './replacementPath/src/mixins'
			})
		).toEqual(path.join('./replacementPath/src/mixins', 'somethingNice/mixinFile.js'))
	})

	it('should not resolve partial aliased', () => {
		const aliasedPath = resolveAliases('@myPath/somethingNice/mixinFile.js', {
			'@': './replacementPath/src/mixins'
		})
		expect(aliasedPath).not.toContain('replacementPath')
	})

	it('should resolve an alias from an array', () => {
		expect(
			resolveAliases('myPath/somethingNice/mixinFile.js', {
				myPath: [
					'./replacementPath/src/mixins',
					'./replacementPath2/src/mixins'
				]
			}, '/')
		).toEqual(path.resolve('/replacementPath/src/mixins', 'somethingNice/mixinFile.js'))
	})

	it('should not resolve an alias from an array', () => {
		const aliasedPath = resolveAliases('@myPath/somethingNice/mixinFile.js', {
			'@': [
				'./replacementPath/src/mixins',
				'./replacementPath2/src/mixins'
			]
		}, '/')
		expect(aliasedPath).not.toContain('replacementPath')
	})

	it('should not resolve an alias from an non-existing file', () => {
		const aliasedPath = resolveAliases('myPath/somethingNice/nonExistingMixinFile.js', {
			myPath: [
				'./replacementPath/src/mixins',
				'./replacementPath2/src/mixins'
			]
		}, '/')
		expect(aliasedPath).not.toContain('replacementPath')
	})
})
