import getSources from '../getSources'

let mockWatch: jest.Mock
let mockAddWatch: jest.Mock
let fakeOn: jest.Mock
let mockGlobby: jest.Mock
let fakeWatcher: any
jest.mock('chokidar', () => {
	mockAddWatch = jest.fn()
	fakeOn = jest.fn((item, cb) => {
		if (item === 'ready') {
			cb()
		}
	})
	fakeWatcher = {
		add: mockAddWatch,
		on: fakeOn
	}
	mockWatch = jest.fn(() => fakeWatcher)
	return {
		watch: mockWatch
	}
})

jest.mock('vue-docgen-api', () => ({
	parse: jest.fn(() => ({})),
	ScriptHandlers: {
		componentHandler: jest.fn()
	}
}))

jest.mock('globby', () => {
	mockGlobby = jest.fn(() => FILES)
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
