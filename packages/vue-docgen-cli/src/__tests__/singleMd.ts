import { compile, DocgenCLIConfigWithOutFile } from '../singleMd'
import extractConfig from '../extractConfig'
import { writeDownMdFile } from '../utils'

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

describe('singleMd', () => {
	const CWD = 'here'
	const FAKE_COMPONENT_PATH = 'here'
	const FAKE_COMPONENT_FULL_PATH = 'component/is/here'
	const MD_FILE_PATH = 'files/docs.md'
	let conf: DocgenCLIConfigWithOutFile

	beforeEach(() => {
		conf = extractConfig([], CWD) as DocgenCLIConfigWithOutFile
		conf.components = '**/*.vue'
		conf.outFile = 'files/docs.md'
		conf.getDocFileName = jest.fn(() => FAKE_COMPONENT_FULL_PATH)
		conf.getDestFile = jest.fn(() => MD_FILE_PATH)
	})

	it('should get the current components doc', async done => {
		await compile(conf, [FAKE_COMPONENT_PATH], {}, {})
		expect(writeDownMdFile).toHaveBeenCalledWith(FAKE_MD_CONTENT, MD_FILE_PATH)
		done()
	})
})
