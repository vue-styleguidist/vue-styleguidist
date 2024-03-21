import * as path from 'path'
import * as fs from 'fs'
import prettier from 'prettier'
import { SpyInstance } from 'vitest'
import { writeDownMdFile, getDocMap, resolveRequiresFromTag } from './utils'

const UGLY_MD = 'ugly'
const PRETTY_MD = 'pretty'
const MD_FILE_PATH = 'test/file'

vi.mock('fs', () => {
	const cws = {
		write: vi.fn(),
		close: vi.fn()
	}
	const mockFs: any = {
		readFile: vi.fn((a, b, c) => c()),
		writeFile: vi.fn((a, b, c) => c()),
		createWriteStream: () => cws,
		existsSync: vi.fn(() => false),
		readdirSync: vi.fn(() => []),
		mkdir: vi.fn((a, b, c) => c())
	}

	mockFs.default = mockFs
	return mockFs
})

vi.mock('prettier')
vi.mock('./compileTemplates')

let mockPrettierFormat: SpyInstance
let mockResolveConfig: SpyInstance
let cwsWrite: SpyInstance

describe('utils', () => {
	beforeEach(() => {
		cwsWrite = vi.fn()
		vi.spyOn(fs, 'createWriteStream').mockImplementation(
			() =>
				({
					write: cwsWrite,
					close: vi.fn()
				} as any)
		)
		mockPrettierFormat = vi.spyOn(prettier, 'format')
		mockPrettierFormat.mockImplementation(() => PRETTY_MD)
		mockResolveConfig = vi.spyOn(prettier, 'resolveConfig')
		mockResolveConfig.mockResolvedValue(null)
	})

	describe('writeDownMdFile', () => {
		it('should prettify before saving', async () => {
			await writeDownMdFile(UGLY_MD, MD_FILE_PATH)
			expect(mockPrettierFormat).toHaveBeenCalledWith(UGLY_MD, { parser: 'markdown' })
		})

		it('should then save the prettified markdown', async () => {
			await writeDownMdFile(UGLY_MD, MD_FILE_PATH)
			expect(cwsWrite).toHaveBeenCalledWith(PRETTY_MD)
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
				{
				  "src/components/Button/Readme.md": "src/components/Button/Button.vue",
				  "src/components/CounterButton/Readme.md": "src/components/CounterButton/CounterButton.vue",
				  "src/components/Input/Readme.md": "src/components/Input/Input.vue",
				  "src/components/PushButton/Readme.md": "src/components/PushButton/PushButton.vue",
				}
			`)
		})
	})

	describe('resolveRequiresFromTag', () => {
		it('should return the requires from the tags', () => {
			const tags = [{ description: './file1' }, { description: './file2' }]
			const requires = resolveRequiresFromTag(tags, MD_FILE_PATH)
			expect(requires).toMatchInlineSnapshot(`
				[
				  "test/file/file1",
				  "test/file/file2",
				]
			`)
		})

		it('should return the requires from one single tag separated by returns', () => {
			const tags = [{ content: './file1\n./file2' }]
			const requires = resolveRequiresFromTag(tags, MD_FILE_PATH)
			expect(requires).toMatchInlineSnapshot(`
				[
				  "test/file/file1",
				  "test/file/file2",
				]
			`)
		})

		it('should return the requires from one single tag separated by commas', () => {
			const tags = [{ description: "'./file1','./file2'" }]
			const requires = resolveRequiresFromTag(tags, MD_FILE_PATH)
			expect(requires).toMatchInlineSnapshot(`
				[
				  "test/file/file1",
				  "test/file/file2",
				]
			`)
		})

		it('should return the requires from one single tag with single quotes', () => {
			const tags = [{ content: "'./file1'\n'./file2'" }]
			const requires = resolveRequiresFromTag(tags, MD_FILE_PATH)
			expect(requires).toMatchInlineSnapshot(`
				[
				  "test/file/file1",
				  "test/file/file2",
				]
			`)
		})

		it('should return the requires from one single tag with double quotes', () => {
			const tags = [{ content: '"./file1"\n"./file2"' }]
			const requires = resolveRequiresFromTag(tags, MD_FILE_PATH)
			expect(requires).toMatchInlineSnapshot(`
				[
				  "test/file/file1",
				  "test/file/file2",
				]
			`)
		})
	})
})
