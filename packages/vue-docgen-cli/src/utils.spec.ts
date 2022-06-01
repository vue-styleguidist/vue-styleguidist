import * as path from 'path'
import { SpyInstance } from 'vitest'
import { writeDownMdFile, getDocMap } from './utils'

const UGLY_MD = 'ugly'
const PRETTY_MD = 'pretty'
const MD_FILE_PATH = 'test/file'

let mockFs: {
	readFile: SpyInstance
	writeFile: SpyInstance
	existsSync: SpyInstance
	createWriteStream: (
		a: string
	) => {
		write: SpyInstance
		close: SpyInstance
	}
}

let cws: {
	write: SpyInstance
	close: SpyInstance
}

vi.mock('fs', () => {
	cws = {
		write: vi.fn(),
		close: vi.fn()
	}
	mockFs = {
		readFile: vi.fn((a, b, c) => c()),
		writeFile: vi.fn((a, b, c) => c()),
		createWriteStream: () => cws,
		existsSync: vi.fn(() => false)
	}
	return mockFs
})

let mockPrettierFormat: SpyInstance
let mockResolveConfig: SpyInstance
vi.mock('prettier', () => {
	mockPrettierFormat = vi.fn(() => PRETTY_MD)
	mockResolveConfig = vi.fn(() => null)
	return {
		format: mockPrettierFormat,
		resolveConfig: mockResolveConfig
	}
})

let mockMkdirp: SpyInstance
vi.mock('mkdirp', () => {
	mockMkdirp = vi.fn((p, c) => c())
	return mockMkdirp
})

let mockCompileTemplates: SpyInstance
vi.mock('../compileTemplates', () => {
	mockCompileTemplates = vi.fn()
	return mockCompileTemplates
})

describe('writeDownMdFile', () => {
	it('should pretify before saving', async () => {
		await writeDownMdFile(UGLY_MD, MD_FILE_PATH)
		expect(mockPrettierFormat).toHaveBeenCalledWith(UGLY_MD, { parser: 'markdown' })
	})

	it('should then save the pretified markdown', async () => {
		await writeDownMdFile(UGLY_MD, MD_FILE_PATH)
		expect(cws.write).toHaveBeenCalledWith(PRETTY_MD)
	})

	it('should resolve the config from the filesystem', async () => {
		mockResolveConfig.mockReturnValue({ semi: false })
		await writeDownMdFile(UGLY_MD, MD_FILE_PATH)
		expect(mockPrettierFormat).toHaveBeenCalledWith(UGLY_MD, { semi: false, parser: 'markdown' })
	})
})

const FILES = [
	'src/components/Button/Button.vue',
	'src/components/Input/Input.vue',
	'src/components/CounterButton/CounterButton.vue',
	'src/components/PushButton/PushButton.vue'
]

const getDocFileName = (componentPath: string) =>
	path.resolve(path.dirname(componentPath), 'Readme.md')

describe('getDocMap', () => {
	it('should return relative maps', () => {
		const docMap = getDocMap(FILES, getDocFileName, 'src')
		// normalize path for windows users
		Object.keys(docMap).forEach(k => {
			const rawPath = docMap[k]
			delete docMap[k]
			docMap[k.replace(/\\/g, '/')] = rawPath
		})
		expect(docMap).toMatchInlineSnapshot(`
		Object {
		  "src/components/Button/Readme.md": "src/components/Button/Button.vue",
		  "src/components/CounterButton/Readme.md": "src/components/CounterButton/CounterButton.vue",
		  "src/components/Input/Readme.md": "src/components/Input/Input.vue",
		  "src/components/PushButton/Readme.md": "src/components/PushButton/PushButton.vue",
		}
	`)
	})
})
