import { compile } from '../multiMd'
import extractConfig from '../extractConfig'
import { writeDownMdFile } from '../utils'
import { DocgenCLIConfigWithComponents } from '../docgen'

const FAKE_MD_CONTENT = '## fake markdonw Content'

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

	beforeEach(() => {
		conf = extractConfig([], CWD) as DocgenCLIConfigWithComponents
		conf.components = '**/*.vue'
		conf.getDocFileName = jest.fn(() => FAKE_COMPONENT_FULL_PATH)
		conf.getDestFile = jest.fn(() => MD_FILE_PATH)
	})

	it('should get the current components doc', async done => {
		await compile(conf, {}, FAKE_COMPONENT_PATH)
		expect(writeDownMdFile).toHaveBeenCalledWith(FAKE_MD_CONTENT, MD_FILE_PATH)
		done()
	})
})
