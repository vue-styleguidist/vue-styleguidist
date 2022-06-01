import extractConfig from './extractConfig'
import docgen, { DocgenCLIConfig } from './docgen'
import { SpyInstance } from 'vitest'

const FILES = ['src/comps/button/button.vue', 'src/comps/checkbox/checkbox.vue']
const DOC_MAP = {
	'src/comps/button/Readme.md': 'src/comps/button/button.vue'
}

let mockGetSources: SpyInstance
let mockWatcher: unknown
vi.mock('../getSources', () => {
	mockWatcher = { on: vi.fn(), close: vi.fn() }
	mockGetSources = vi.fn(() =>
		Promise.resolve({ componentFiles: FILES, watcher: mockWatcher, docMap: DOC_MAP })
	)
	return mockGetSources
})

let mockSingle: SpyInstance
vi.mock('../singleMd', () => {
	mockSingle = vi.fn()
	return mockSingle
})

let mockMulti: SpyInstance
vi.mock('../multiMd', () => {
	mockMulti = vi.fn()
	return mockMulti
})

describe('docgen', () => {
	const CWD = 'here'
	const MD_FILE_PATH = 'files/docs.md'
	let conf: DocgenCLIConfig

	beforeEach(() => {
		conf = extractConfig(CWD)
		conf.components = '**/*.vue'
		conf.getDestFile = vi.fn(() => MD_FILE_PATH)
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
