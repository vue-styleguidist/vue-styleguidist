import { SpyInstance } from 'vitest'
import getSources from './getSources'

let mockWatch: SpyInstance
let mockAddWatch: SpyInstance
let fakeOn: SpyInstance
let mockGlobby: SpyInstance
let fakeWatcher: any
vi.mock('chokidar', () => {
	mockAddWatch = vi.fn()
	fakeOn = vi.fn((item, cb) => {
		if (item === 'ready') {
			cb()
		}
	})
	fakeWatcher = {
		add: mockAddWatch,
		on: fakeOn
	}
	mockWatch = vi.fn(() => fakeWatcher)
	return {
		watch: mockWatch
	}
})

vi.mock('vue-docgen-api', () => ({
	parse: vi.fn(() => ({})),
	ScriptHandlers: {
		componentHandler: vi.fn()
	}
}))

vi.mock('globby', () => {
	mockGlobby = vi.fn(() => FILES)
	return mockGlobby
})

const FILES = [
	'src/components/Button/Button.vue',
	'src/components/Input/Input.vue',
	'src/components/CounterButton/CounterButton.vue',
	'src/components/PushButton/PushButton.vue'
]

const COMPONENTS_GLOB = 'components/**/*.vue'

const getDocFileName = (componentPath: string) => `path/to/Readme.md+${componentPath}`

describe('getSources', () => {
	it('should return component files from chokidar', async () => {
		const { componentFiles } = await getSources(COMPONENTS_GLOB, 'here', getDocFileName)
		expect(componentFiles).toMatchInlineSnapshot(`
		Array [
		  "src/components/Button/Button.vue",
		  "src/components/Input/Input.vue",
		  "src/components/CounterButton/CounterButton.vue",
		  "src/components/PushButton/PushButton.vue",
		]
	`)
	})

	it('should return a docMap using the getDocFileName', async () => {
		const { docMap } = await getSources(COMPONENTS_GLOB, 'here', getDocFileName)
		expect(docMap).toMatchInlineSnapshot(`
		Object {
		  "../path/to/Readme.md+here/src/components/Button/Button.vue": "src/components/Button/Button.vue",
		  "../path/to/Readme.md+here/src/components/CounterButton/CounterButton.vue": "src/components/CounterButton/CounterButton.vue",
		  "../path/to/Readme.md+here/src/components/Input/Input.vue": "src/components/Input/Input.vue",
		  "../path/to/Readme.md+here/src/components/PushButton/PushButton.vue": "src/components/PushButton/PushButton.vue",
		}
	`)
	})

	it('should return the watcher so it can be enriched', async () => {
		const { watcher } = await getSources(COMPONENTS_GLOB, 'here', getDocFileName)
		expect(watcher).toBe(fakeWatcher)
	})
})
