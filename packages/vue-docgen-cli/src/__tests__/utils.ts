import * as path from 'path'
import { writeDownMdFile, compileMarkdown, getDocMap, getWatcher } from '../utils'
import extractConfig, { DocgenCLIConfig } from '../extractConfig'

const UGLY_MD = 'ugly'
const PRETTY_MD = 'pretty'
const MD_FILE_PATH = 'test/file'

var mockFs: {
	readFile: jest.Mock
	writeFile: jest.Mock
	existsSync: jest.Mock
}
jest.mock('fs', () => {
	mockFs = {
		readFile: jest.fn((a, b, c) => c()),
		writeFile: jest.fn((a, b, c) => c()),
		existsSync: jest.fn(() => false)
	}
	return mockFs
})

var mockPrettierFormat: jest.Mock
jest.mock('prettier', () => {
	mockPrettierFormat = jest.fn(() => PRETTY_MD)
	return {
		format: mockPrettierFormat
	}
})

var mockMkdirp: jest.Mock
jest.mock('mkdirp', () => {
	mockMkdirp = jest.fn((p, c) => c())
	return mockMkdirp
})

var mockCompileTemplates: jest.Mock
jest.mock('../compileTemplates', () => {
	mockCompileTemplates = jest.fn()
	return mockCompileTemplates
})

describe('writeDownMdFile', () => {
	it('should pretify before saving', async done => {
		await writeDownMdFile(UGLY_MD, MD_FILE_PATH)
		expect(mockPrettierFormat).toHaveBeenCalledWith(UGLY_MD, { parser: 'markdown' })
		done()
	})

	it('should then save the pretified markdown', async done => {
		await writeDownMdFile(UGLY_MD, MD_FILE_PATH)
		expect(mockFs.writeFile).toHaveBeenCalledWith(MD_FILE_PATH, PRETTY_MD, expect.any(Function))
		done()
	})
})

describe('compileMarkdown', () => {
	const CWD = 'here'
	const FAKE_COMPONENT_PATH = 'here'
	const COMPONENT_ROOT = 'componets/are/here'
	const FAKE_COMPONENT_FULL_PATH = 'component/is/here'
	const EXTRA_CONTENT = 'extra content documentation'
	let conf: DocgenCLIConfig

	beforeEach(() => {
		conf = extractConfig([], CWD)
		conf.getDocFileName = jest.fn(() => FAKE_COMPONENT_FULL_PATH)
		conf.getDestFile = jest.fn(() => MD_FILE_PATH)
	})

	it('should call getDocFileName to determine the extra docs file bs path', async done => {
		await compileMarkdown(conf, FAKE_COMPONENT_PATH)
		expect(conf.getDocFileName).toHaveBeenCalledWith(path.join(CWD, FAKE_COMPONENT_PATH))
		done()
	})

	it('should call compileTemplates with the right name and config', async done => {
		conf.componentsRoot = COMPONENT_ROOT
		await compileMarkdown(conf, FAKE_COMPONENT_PATH)
		expect(mockCompileTemplates).toHaveBeenCalledWith(
			path.join(COMPONENT_ROOT, FAKE_COMPONENT_PATH),
			conf,
			FAKE_COMPONENT_PATH,
			undefined
		)
		done()
	})

	it('should add extra content if it exists', async done => {
		conf.componentsRoot = COMPONENT_ROOT
		mockFs.readFile.mockImplementation(
			(file: string, opt: any, cb: (e: any, content: string | null) => void) => {
				if (file === FAKE_COMPONENT_FULL_PATH) {
					cb(null, EXTRA_CONTENT)
				}
				cb(null, null)
			}
		)
		await compileMarkdown(conf, FAKE_COMPONENT_PATH)
		expect(mockCompileTemplates).toHaveBeenCalledWith(
			path.join(COMPONENT_ROOT, FAKE_COMPONENT_PATH),
			conf,
			FAKE_COMPONENT_PATH,
			EXTRA_CONTENT
		)
		done()
	})
})

var mockWatch: jest.Mock, mockAddWatch: jest.Mock
jest.mock('chokidar', () => {
	mockAddWatch = jest.fn()
	mockWatch = jest.fn(() => ({
		add: mockAddWatch
	}))
	return {
		watch: mockWatch
	}
})

const FILES = [
	'src/components/Button/Button.vue',
	'src/components/Input/Input.vue',
	'src/components/CounterButton/CounterButton.vue',
	'src/components/PushButton/PushButton.vue'
]

const COMPONENTS_GLOB = 'components/**/*.vue'

const getDocFileName = (componentPath: string) =>
	path.resolve(path.dirname(componentPath), 'Readme.md')

describe('getWatcher', () => {
	it('should watch the files passed', () => {
		mockWatch.mockClear()
		getWatcher(COMPONENTS_GLOB, 'src', FILES)
		expect(mockWatch).toHaveBeenCalledWith(COMPONENTS_GLOB, expect.any(Object))
	})

	it('should add all the additional files', () => {
		mockAddWatch.mockClear()
		getWatcher(COMPONENTS_GLOB, 'src', FILES)
		expect(mockAddWatch).toHaveBeenCalledWith(FILES)
	})
})

describe('getDocMap', () => {
	it('should return relative maps', () => {
		const docMap = getDocMap(FILES, getDocFileName, 'src')
		expect(docMap).toMatchInlineSnapshot(`
		Object {
		  "components/Button/Readme.md": "src/components/Button/Button.vue",
		  "components/CounterButton/Readme.md": "src/components/CounterButton/CounterButton.vue",
		  "components/Input/Readme.md": "src/components/Input/Input.vue",
		  "components/PushButton/Readme.md": "src/components/PushButton/PushButton.vue",
		}
	`)
	})
})
