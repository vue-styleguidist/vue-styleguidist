import getSources from '../getSources'

var mockWatch: jest.Mock, mockAddWatch: jest.Mock, fakeOn: jest.Mock, mockGetWatched: jest.Mock
let fakeWatcher: any
jest.mock('chokidar', () => {
	mockAddWatch = jest.fn()
	fakeOn = jest.fn((item, cb) => {
		if (item === 'ready') {
			cb()
		}
	})
	mockGetWatched = jest.fn(() => ({ dir: FILES }))
	fakeWatcher = {
		add: mockAddWatch,
		on: fakeOn,
		getWatched: mockGetWatched
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

const FILES = [
	'src/components/Button/Button.vue',
	'src/components/Input/Input.vue',
	'src/components/CounterButton/CounterButton.vue',
	'src/components/PushButton/PushButton.vue'
]

const COMPONENTS_GLOB = 'components/**/*.vue'

const getDocFileName = (componentPath: string) => `path/to/Readme.md+${componentPath}`

describe('getSources', () => {
	it('should return component files from chokidar', async done => {
		const { componentFiles } = await getSources(COMPONENTS_GLOB, 'here', getDocFileName)
		expect(componentFiles).toMatchInlineSnapshot(`
		Array [
		  "dir/src/components/Button/Button.vue",
		  "dir/src/components/Input/Input.vue",
		  "dir/src/components/CounterButton/CounterButton.vue",
		  "dir/src/components/PushButton/PushButton.vue",
		]
	`)
		done()
	})

	it('should return a docMap using the getDocFileName', async done => {
		const { docMap } = await getSources(COMPONENTS_GLOB, 'here', getDocFileName)
		expect(docMap).toMatchInlineSnapshot(`
		Object {
		  "../path/to/Readme.md+here/dir/src/components/Button/Button.vue": "dir/src/components/Button/Button.vue",
		  "../path/to/Readme.md+here/dir/src/components/CounterButton/CounterButton.vue": "dir/src/components/CounterButton/CounterButton.vue",
		  "../path/to/Readme.md+here/dir/src/components/Input/Input.vue": "dir/src/components/Input/Input.vue",
		  "../path/to/Readme.md+here/dir/src/components/PushButton/PushButton.vue": "dir/src/components/PushButton/PushButton.vue",
		}
	`)
		done()
	})

	it('should return the watcher so it can be enriched', async done => {
		const { watcher } = await getSources(COMPONENTS_GLOB, 'here', getDocFileName)
		expect(watcher).toBe(fakeWatcher)
		done()
	})
})
