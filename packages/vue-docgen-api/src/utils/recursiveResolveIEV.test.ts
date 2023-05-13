import { SpyInstance } from 'vitest'
import makePathResolver from './makePathResolver'
import recursiveResolveIEV from './recursiveResolveIEV'
import { ImportedVariableSet } from './resolveRequired'
import * as resolvePathFrom from './resolvePathFrom'

vi.mock('../resolveImmediatelyExported')
vi.mock('./resolvePathFrom')

describe('recursiveResolveIEV', () => {
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
				exportName: 'exportName'
			}
		}
		mockResolver = vi.spyOn(spies, 'pathResolver')
		vi.spyOn(resolvePathFrom, 'default').mockImplementation(p => `absolute/${p}`)
	})

	it('should call the resolver', async () => {
		await recursiveResolveIEV(spies.pathResolver, set, () => true)
		expect(mockResolver).toHaveBeenCalledWith('component/local/path')
	})

	it('should not resolve anything if multiple path in filePath', async () => {
		set.test.filePath.push('baz')
		await recursiveResolveIEV(spies.pathResolver, set, () => true)

		expect(mockResolver).not.toHaveBeenCalledWith('baz')
	})

	it('should should have nothing in the set when validExtends is false', async () => {
		await recursiveResolveIEV(spies.pathResolver, set, p => p.endsWith('Bis'))

		expect(set).toMatchInlineSnapshot(`
			{
			  "testBis": {
			    "exportName": "exportName",
			    "filePath": [
			      "component/local/pathBis",
			    ],
			  },
			}
		`)
	})
})
