import chokidar from 'chokidar'
import * as globby from 'globby'
import { SpyInstance } from 'vitest'
import getSources from './getSources'

vi.mock('chokidar')
vi.mock('globby')

vi.mock('vue-docgen-api', () => ({
	ScriptHandlers: {
		componentHandler: vi.fn()
	}
}))

const FILES = [
	'src/components/Button/Button.vue',
	'src/components/Input/Input.vue',
	'src/components/CounterButton/CounterButton.vue',
	'src/components/PushButton/PushButton.vue'
]

const COMPONENTS_GLOB = 'components/**/*.vue'

const getDocFileName = (componentPath: string) => `path/to/Readme.md+${componentPath}`

describe('getSources', () => {
	let mockWatch: SpyInstance
	let mockAddWatch: SpyInstance
	let fakeOn: SpyInstance
	let mockGlobby: SpyInstance
	let fakeWatcher: any
  const mockParse = vi.fn(() => ([] as any))

	beforeEach(() => {
		fakeOn = vi.fn((item, cb) => {
			if (item === 'ready') {
				cb()
			}
		})
		mockAddWatch = vi.fn()
		fakeWatcher = {
			add: mockAddWatch,
			on: fakeOn
		}
		mockWatch = vi.spyOn(chokidar, 'watch')
		mockWatch.mockImplementation(() => fakeWatcher)
		mockGlobby = vi.spyOn(globby, 'default')
		mockGlobby.mockImplementation(() => Promise.resolve(FILES))
	})

	it('should return component files from chokidar', async () => {
		const { componentFiles } = await getSources(COMPONENTS_GLOB, [], 'here', getDocFileName, mockParse)
		expect(componentFiles).toMatchInlineSnapshot(`
			[
			  "src/components/Button/Button.vue",
			  "src/components/Input/Input.vue",
			  "src/components/CounterButton/CounterButton.vue",
			  "src/components/PushButton/PushButton.vue",
			]
		`)
	})

	it('should return a docMap using the getDocFileName', async () => {
		const { docMap } = await getSources(COMPONENTS_GLOB, [], 'here', getDocFileName, mockParse)
		expect(docMap).toMatchInlineSnapshot(`
			{
			  "../path/to/Readme.md+here/src/components/Button/Button.vue": "src/components/Button/Button.vue",
			  "../path/to/Readme.md+here/src/components/CounterButton/CounterButton.vue": "src/components/CounterButton/CounterButton.vue",
			  "../path/to/Readme.md+here/src/components/Input/Input.vue": "src/components/Input/Input.vue",
			  "../path/to/Readme.md+here/src/components/PushButton/PushButton.vue": "src/components/PushButton/PushButton.vue",
			}
		`)
	})

	it('should return the watcher so it can be enriched', async () => {
		const { watcher } = await getSources(COMPONENTS_GLOB, [], 'here', getDocFileName, mockParse)
		expect(watcher).toBe(fakeWatcher)
	})
})
