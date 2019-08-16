import { FSWatcher } from 'chokidar'
import extractConfig, { DocgenCLIConfig } from '../extractConfig'
import docgen from '../docgen'

const FILES = ['src/comps/button/button.vue', 'src/comps/checkbox/checkbox.vue']
const DOC_MAP = {
	'src/comps/button/Readme.md': 'src/comps/button/button.vue'
}

var mockGlobby: jest.Mock
jest.mock('globby', () => {
	mockGlobby = jest.fn(() => Promise.resolve(FILES))
	return mockGlobby
})

var mockGetWatcher: jest.Mock
var mockGetDocMap: jest.Mock
var mockWatcher: FSWatcher
jest.mock('../utils', () => {
	mockWatcher = ({ on: jest.fn() } as unknown) as FSWatcher
	mockGetWatcher = jest.fn(() => mockWatcher)
	mockGetDocMap = jest.fn(() => DOC_MAP)
	return {
		getWatcher: mockGetWatcher,
		getDocMap: mockGetDocMap
	}
})

var mockSingle: jest.Mock
jest.mock('../singleMd', () => {
	mockSingle = jest.fn()
	return mockSingle
})

var mockMulti: jest.Mock
jest.mock('../multiMd', () => {
	mockMulti = jest.fn()
	return mockMulti
})

describe('docgen', () => {
	const CWD = 'here'
	const MD_FILE_PATH = 'files/docs.md'
	let conf: DocgenCLIConfig

	beforeEach(() => {
		conf = extractConfig([], CWD)
		conf.components = '**/*.vue'
		conf.getDestFile = jest.fn(() => MD_FILE_PATH)
	})

	it('should just return when no components are specified', async done => {
		delete conf.components
		await docgen(conf)
		expect(mockGlobby).not.toHaveBeenCalled()
		done()
	})

	it('should call multi by default', async done => {
		await docgen(conf)
		expect(mockMulti).toHaveBeenCalled()
		expect(mockMulti).toHaveBeenCalledWith(FILES, undefined, conf, DOC_MAP)
		done()
	})

	it('should call single if an outfile is specified', async done => {
		conf.outFile = 'test.md'
		await docgen(conf)
		expect(mockSingle).toHaveBeenCalledWith(FILES, undefined, conf, DOC_MAP)
		done()
	})

	it('if watch is passed should pass a watcher to compiler', async done => {
		conf.watch = true
		await docgen(conf)
		expect(mockMulti).toHaveBeenCalledWith(FILES, mockWatcher, conf, DOC_MAP)
		done()
	})

	afterEach(() => {
		mockGlobby.mockClear()
		mockMulti.mockClear()
		mockSingle.mockClear()
	})
})
