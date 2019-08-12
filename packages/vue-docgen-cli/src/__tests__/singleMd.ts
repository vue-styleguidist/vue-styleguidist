import { FSWatcher } from 'chokidar'
import * as singleMd from '../singleMd'
import extractConfig from '../extractConfig'
import { writeDownMdFile } from '../utils'

const FAKE_MD_CONTENT = '## fake markdonw Content'
const FILES = ['src/comps/button/button.vue']

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

describe('compile', () => {
	const CWD = 'here'
	const FAKE_COMPONENT_PATH = 'here'
	const MD_FILE_PATH = 'files/docs.md'
	let conf: singleMd.DocgenCLIConfigWithOutFile
	const fakeOn = jest.fn()
	let w = {
		on: fakeOn.mockImplementation(() => ({ on: fakeOn }))
	}

	beforeEach(() => {
		conf = extractConfig([], CWD) as singleMd.DocgenCLIConfigWithOutFile
		conf.components = '**/*.vue'
		conf.outFile = 'files/docs.md'
		conf.getDestFile = jest.fn(() => MD_FILE_PATH)
	})

	describe('compile', () => {
		it('should get the current components doc', async done => {
			await singleMd.compile(conf, [FAKE_COMPONENT_PATH], {}, {})
			expect(writeDownMdFile).toHaveBeenCalledWith(FAKE_MD_CONTENT, MD_FILE_PATH)
			done()
		})
	})

	describe('default', () => {
		it('should build one md from merging contents', () => {
			jest.spyOn(singleMd, 'compile').mockImplementation(() => Promise.resolve())
			singleMd.default(FILES, undefined, conf, {}, singleMd.compile)
			expect(singleMd.compile).toHaveBeenCalledWith(conf, FILES, {}, {})
		})

		it('should watch file changes if a watcher is passed', () => {
			fakeOn.mockClear()
			singleMd.default(FILES, (w as unknown) as FSWatcher, conf, {})
			expect(fakeOn).toHaveBeenCalledWith('add', expect.any(Function))
			expect(fakeOn).toHaveBeenCalledWith('change', expect.any(Function))
		})
	})
})
