import { FSWatcher } from 'chokidar'
import * as multiMd from '../multiMd'
import extractConfig from '../extractConfig'
import { writeDownMdFile } from '../utils'
import { DocgenCLIConfigWithComponents } from '../docgen'

const FAKE_MD_CONTENT = '## fake markdonw Content'
const FILES = ['src/comps/button/button.vue', 'src/comps/checkbox/checkbox.vue']

let mockWriteDownMdFile: jest.Mock
jest.mock('../utils', () => {
	mockWriteDownMdFile = jest.fn(() => Promise.resolve())
	return {
		writeDownMdFile: mockWriteDownMdFile
	}
})

let mockCompileMarkdown: jest.Mock
jest.mock('../compileTemplates', () => {
	mockCompileMarkdown = jest.fn(() =>
		Promise.resolve({ content: FAKE_MD_CONTENT, dependencies: [] })
	)
	return mockCompileMarkdown
})

describe('multiMd', () => {
	const CWD = 'here'
	const FAKE_COMPONENT_PATH = 'here'
	const FAKE_COMPONENT_FULL_PATH = 'component/is/here'
	const MD_FILE_PATH = 'files/docs.md'
	let conf: DocgenCLIConfigWithComponents
	const fakeOn = jest.fn()
	const w = ({
		on: fakeOn.mockImplementation(() => ({ on: fakeOn }))
	} as unknown) as FSWatcher

	beforeEach(() => {
		conf = extractConfig(CWD) as DocgenCLIConfigWithComponents
		conf.components = '**/*.vue'
		conf.getDocFileName = jest.fn(() => FAKE_COMPONENT_FULL_PATH)
		conf.getDestFile = jest.fn(() => MD_FILE_PATH)
	})

	describe('compile', () => {
		it('should get the current components doc', async () => {
			await multiMd.compile(conf, {}, w, FAKE_COMPONENT_PATH)
			expect(writeDownMdFile).toHaveBeenCalledWith(FAKE_MD_CONTENT, MD_FILE_PATH)
		})
	})

	describe('default', () => {
		it('should build one md from each file passed', async () => {
			jest.spyOn(multiMd, 'compile').mockImplementation(() => Promise.resolve())
			await multiMd.default(FILES, w, conf, {}, multiMd.compile)
			expect(multiMd.compile).toHaveBeenCalledTimes(FILES.length)
		})

		it('should watch file changes if a watcher is passed', async () => {
			conf.watch = true
			fakeOn.mockClear()
			await multiMd.default(FILES, w, conf, {})
			expect(fakeOn).toHaveBeenCalledWith('add', expect.any(Function))
			expect(fakeOn).toHaveBeenCalledWith('change', expect.any(Function))
			expect(fakeOn).toHaveBeenCalledWith('unlink', expect.any(Function))
		})
	})
})
