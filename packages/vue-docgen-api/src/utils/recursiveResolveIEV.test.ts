import { SpyInstance } from 'vitest'
import makePathResolver from './makePathResolver'
import recursiveResolveIEV, { resolveIEV } from './recursiveResolveIEV'
import { ImportedVariableSet } from './resolveRequired'
import * as resolvePathFrom from './resolvePathFrom'

vi.mock('fs', async () => {
	return {
		default: {
			promises: {
				readFile: (p: string) => {
					if (p.endsWith('component/local/path')) {
						return Promise.resolve(
							[
								`export { mixin as test } from "path/to/mixin"`,
								`export * from "path/to/another/mixin"`,
								`export * from "path/to/one/another/mixin"`
							].join('\n')
						)
					}
					return Promise.resolve('')
				}
			}
		}
	}
})
vi.mock('./resolvePathFrom')

describe('IEV', () => {
	let set: ImportedVariableSet
	let mockResolver: SpyInstance<
		[filePath: string, originalDirNameOverride?: string | undefined],
		string | null
	>
	const spies = {
		pathResolver: makePathResolver('../component', {}, [])
	}
	beforeEach(() => {
		set = {
			test: {
				filePath: ['component/local/path'],
				exportName: 'exportName'
			},
			testBis: {
				filePath: ['component/local/pathBis'],
				exportName: 'exportNameBis'
			}
		}
		mockResolver = vi.spyOn(spies, 'pathResolver')
		vi.spyOn(resolvePathFrom, 'default').mockImplementation(p => `absolute/${p}`)
	})

	describe('resolveIEV', () => {
		it('should call the resolver', async () => {
			await resolveIEV(spies.pathResolver, set, () => true)
			expect(resolvePathFrom.default).toHaveBeenCalledWith('component/local/path', ['../component'])
			expect(set).not.toBeUndefined()
			expect(set).toMatchInlineSnapshot(`
				{
				  "test": {
				    "exportName": "exportName",
				    "filePath": [
				      "absolute/path/to/another/mixin",
				      "absolute/path/to/one/another/mixin",
				    ],
				  },
				  "testBis": {
				    "exportName": "exportNameBis",
				    "filePath": [
				      "component/local/pathBis",
				    ],
				  },
				}
			`)
		})
	})

	describe('recursiveResolveIEV', () => {
		it('should call the resolver', async () => {
			await recursiveResolveIEV(spies.pathResolver, set, () => true)
			expect(mockResolver).toHaveBeenCalledWith('component/local/path')
		})

		it('should resolve if multiple path in filePath', async () => {
			set.test.filePath.push('baz')
			await recursiveResolveIEV(spies.pathResolver, set, () => true)

			expect(mockResolver).toHaveBeenCalledWith('baz')
		})
	})
})
