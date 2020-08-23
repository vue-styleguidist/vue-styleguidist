import extractConfig from '../extractConfig'
import docgen, { DocgenCLIConfig } from '../docgen'

const FILES = ['src/comps/button/button.vue', 'src/comps/checkbox/checkbox.vue']
const DOC_MAP = {
	'src/comps/button/Readme.md': 'src/comps/button/button.vue'
}

let mockGetSources: jest.Mock
let mockWatcher: unknown
jest.mock('../getSources', () => {
	mockWatcher = { on: jest.fn(), close: jest.fn() }
	mockGetSources = jest.fn(() =>
		Promise.resolve({ componentFiles: FILES, watcher: mockWatcher, docMap: DOC_MAP })
	)
	return mockGetSources
})

let mockSingle: jest.Mock
jest.mock('../singleMd', () => {
	mockSingle = jest.fn()
	return mockSingle
})

let mockMulti: jest.Mock
jest.mock('../multiMd', () => {
	mockMulti = jest.fn()
	return mockMulti
})

describe('docgen', () => {
	const CWD = 'here'
	const MD_FILE_PATH = 'files/docs.md'
	let conf: DocgenCLIConfig

	beforeEach(() => {
		conf = extractConfig(CWD)
		conf.components = '**/*.vue'
		conf.getDestFile = jest.fn(() => MD_FILE_PATH)
	})

	it('should call multi by default', async () => {
		await docgen(conf)
		expect(mockMulti).toHaveBeenCalled()
		expect(mockMulti).toHaveBeenCalledWith(FILES, mockWatcher, conf, DOC_MAP)
	})

	it('should call single if an outfile is specified', async () => {
		conf.outFile = 'test.md'
		await docgen(conf)
		expect(mockSingle).toHaveBeenCalledWith(FILES, mockWatcher, conf, DOC_MAP)
	})

	it('if watch is passed should pass a watcher to compiler', async () => {
		conf.watch = true
		await docgen(conf)
		expect(mockMulti).toHaveBeenCalledWith(FILES, mockWatcher, conf, DOC_MAP)
	})

	afterEach(() => {
		mockMulti.mockClear()
		mockSingle.mockClear()
	})
})
