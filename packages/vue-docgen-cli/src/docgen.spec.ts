import { SpyInstance } from 'vitest'
import extractConfig from './extractConfig'
import docgen, { DocgenCLIConfig } from './docgen'
import * as getSources from './getSources'
import * as singleMd from './singleMd'
import * as multiMd from './multiMd'

const FILES = ['src/comps/button/button.vue', 'src/comps/checkbox/checkbox.vue']
const DOC_MAP = {
	'src/comps/button/Readme.md': 'src/comps/button/button.vue'
}

vi.mock('./getSources')

vi.mock('./singleMd')

vi.mock('./multiMd')

describe('docgen', () => {
	const CWD = 'here'
	const MD_FILE_PATH = 'files/docs.md'
	let conf: DocgenCLIConfig
	let mockGetSources: SpyInstance
	let mockWatcher: unknown
	let mockSingle: SpyInstance
	let mockMulti: SpyInstance

	beforeEach(() => {
		conf = extractConfig(CWD)
		conf.components = '**/*.vue'
		conf.getDestFile = vi.fn(() => MD_FILE_PATH)

		mockWatcher = { on: vi.fn(), close: vi.fn() }
		mockGetSources = vi.spyOn(getSources, 'default')
		mockGetSources.mockResolvedValue({
			componentFiles: FILES,
			watcher: mockWatcher,
			docMap: DOC_MAP
		})

		mockSingle = vi.spyOn(singleMd, 'default')
		mockMulti = vi.spyOn(multiMd, 'default')
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
