import { FSWatcher } from 'chokidar'
import * as multiMd from '../multiMd'
import extractConfig from '../extractConfig'
import { writeDownMdFile } from '../utils'
import { DocgenCLIConfigWithComponents } from '../docgen'

const FAKE_MD_CONTENT = '## fake markdonw Content'
const FILES = ['src/comps/button/button.vue', 'src/comps/checkbox/checkbox.vue']

var mockCompileMarkdown: jest.Mock
var mockWriteDownMdFile: jest.Mock
jest.mock('../utils', () => {
	mockCompileMarkdown = jest.fn(async () => FAKE_MD_CONTENT)
	mockWriteDownMdFile = jest.fn(() => Promise.resolve())
	return {
		compileMarkdown: mockCompileMarkdown,
		writeDownMdFile: mockWriteDownMdFile
	}
})

describe('multiMd', () => {
	const CWD = 'here'
	const FAKE_COMPONENT_PATH = 'here'
	const FAKE_COMPONENT_FULL_PATH = 'component/is/here'
	const MD_FILE_PATH = 'files/docs.md'
	let conf: DocgenCLIConfigWithComponents
	const fakeOn = jest.fn()
	let w = {
		on: fakeOn.mockImplementation(() => ({ on: fakeOn }))
	}

	beforeEach(() => {
		conf = extractConfig([], CWD) as DocgenCLIConfigWithComponents
		conf.components = '**/*.vue'
		conf.getDocFileName = jest.fn(() => FAKE_COMPONENT_FULL_PATH)
		conf.getDestFile = jest.fn(() => MD_FILE_PATH)
	})

	describe('compile', () => {
		it('should get the current components doc', async done => {
			await multiMd.compile(conf, {}, FAKE_COMPONENT_PATH)
			expect(writeDownMdFile).toHaveBeenCalledWith(FAKE_MD_CONTENT, MD_FILE_PATH)
			done()
		})
	})

	describe('default', () => {
		it('should build one md from each file passed', () => {
			jest.spyOn(multiMd, 'compile').mockImplementation(() => Promise.resolve())
			multiMd.default(FILES, undefined, conf, {}, multiMd.compile)
			expect(multiMd.compile).toHaveBeenCalledTimes(FILES.length)
		})

		it('should watch file changes if a watcher is passed', () => {
			fakeOn.mockClear()
			multiMd.default(FILES, (w as unknown) as FSWatcher, conf, {})
			expect(fakeOn).toHaveBeenCalledWith('add', expect.any(Function))
			expect(fakeOn).toHaveBeenCalledWith('change', expect.any(Function))
			expect(fakeOn).toHaveBeenCalledWith('unlink', expect.any(Function))
		})
	})
})
