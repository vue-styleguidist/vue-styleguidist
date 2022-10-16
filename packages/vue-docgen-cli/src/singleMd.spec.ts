import { FSWatcher } from 'chokidar'
import * as singleMd from './singleMd'
import extractConfig from './extractConfig'
import { writeDownMdFile } from './utils'

const FAKE_MD_CONTENT = '## fake markdown Content'
const FILES = ['src/comps/button/button.vue']

vi.mock('./utils', () => {
	return {
		writeDownMdFile: vi.fn(() => Promise.resolve())
	}
})

vi.mock('./compileTemplates', () => {
	return {
		default: vi.fn(() => Promise.resolve({ content: FAKE_MD_CONTENT, dependencies: [] }))
	}
})

describe('compile', () => {
	const CWD = 'here'
	const FAKE_COMPONENT_PATH = 'here'
	const MD_FILE_PATH = 'files/docs.md'
	let conf: singleMd.DocgenCLIConfigWithOutFile
	const fakeOn = vi.fn()
	const w = ({
		on: fakeOn.mockImplementation(() => ({ on: fakeOn }))
	} as unknown) as FSWatcher

	beforeEach(() => {
		conf = extractConfig(CWD) as singleMd.DocgenCLIConfigWithOutFile
		conf.components = '**/*.vue'
		conf.outFile = 'files/docs.md'
		conf.getDestFile = vi.fn(() => MD_FILE_PATH)
	})

	describe('compile', () => {
		it('should get the current components doc', async () => {
			await singleMd.compile(conf, [FAKE_COMPONENT_PATH], {}, {}, w)
			expect(writeDownMdFile).toHaveBeenCalledWith([FAKE_MD_CONTENT], MD_FILE_PATH)
		})
	})

	describe('default', () => {
		it('should build one md from merging contents', async () => {
			vi.spyOn(singleMd, 'compile').mockImplementation(() => Promise.resolve())
			await singleMd.default(FILES, w, conf, {}, singleMd.compile)
			expect(singleMd.compile).toHaveBeenCalledWith(conf, FILES, {}, {}, w)
		})

		it('should watch file changes if a watcher is passed', async () => {
			conf.watch = true
			fakeOn.mockClear()
			await singleMd.default(FILES, w, conf, {})
			expect(fakeOn).toHaveBeenCalledWith('add', expect.any(Function))
			expect(fakeOn).toHaveBeenCalledWith('change', expect.any(Function))
		})
	})
})
