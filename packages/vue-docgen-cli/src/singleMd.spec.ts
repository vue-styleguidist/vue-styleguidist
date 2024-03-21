import { FSWatcher } from 'chokidar'
import * as singleMd from './singleMd'
import extractConfig from './extractConfig'
import { writeDownMdFile } from './utils'

const FAKE_MD_CONTENT_1 = '## first fake markdown Content 1'
const FAKE_MD_CONTENT_2 = '## second fake markdown Content 2'
const FILES = ['src/comps/button/button.vue']

vi.mock('./utils', () => {
	return {
		writeDownMdFile: vi.fn(() => Promise.resolve())
	}
})

vi.mock('./compileTemplates', () => {
	return {
		component: () => '',
		header: () => '',
		props: () => '',
		slots: () => '',
		events: () => '',
		expose: () => '',
		methods: () => '',
		defaultExample: () => '',
		functionalTag: '',
		default: vi.fn((event, filePath) => {
			return filePath === 'here/two'
				? Promise.resolve({ content: FAKE_MD_CONTENT_2, dependencies: [] })
				: Promise.resolve({ content: FAKE_MD_CONTENT_1, dependencies: [] })
		})
	}
})

describe('compile', () => {
	const CWD = 'here'
	const FAKE_COMPONENT_PATH_1 = 'one'
	const FAKE_COMPONENT_PATH_2 = 'two'
	const MD_FILE_PATH = 'files/docs.md'
	let conf: singleMd.DocgenCLIConfigWithOutFile
	const fakeOn = vi.fn()
	const w = {
		on: fakeOn.mockImplementation(() => ({ on: fakeOn }))
	} as unknown as FSWatcher

	beforeEach(async () => {
		conf = (await extractConfig(CWD)) as singleMd.DocgenCLIConfigWithOutFile
		conf.components = '**/*.vue'
		conf.outFile = 'files/docs.md'
		conf.getDestFile = vi.fn(() => MD_FILE_PATH)
		conf.sortComponents = vi.fn((a, b) => a.filePath.localeCompare(b.filePath) as any)
	})

	describe('compile', () => {
		it('should get the current components doc', async () => {
			await singleMd.compile(
				conf,
				[FAKE_COMPONENT_PATH_1, FAKE_COMPONENT_PATH_2],
				{},
				{},
				{},
				w,
				'change'
			)
			expect(writeDownMdFile).toHaveBeenCalledWith(
				[FAKE_MD_CONTENT_1, FAKE_MD_CONTENT_2],
				MD_FILE_PATH
			)
		})

		it('should reverse the order if the sort is reversed', async () => {
			conf.sortComponents = (a, b) => -a.filePath.localeCompare(b.filePath) as any
			await singleMd.compile(
				conf,
				[FAKE_COMPONENT_PATH_1, FAKE_COMPONENT_PATH_2],
				{},
				{},
				{},
				w,
				'change'
			)
			expect(writeDownMdFile).toHaveBeenCalledWith(
				[FAKE_MD_CONTENT_2, FAKE_MD_CONTENT_1],
				MD_FILE_PATH
			)
		})
	})

	describe('default', () => {
		it('should build one md from merging contents', async () => {
			vi.spyOn(singleMd, 'compile').mockImplementation(() => Promise.resolve())
			await singleMd.default(FILES, w, conf, {}, singleMd.compile)
			expect(singleMd.compile).toHaveBeenCalledWith(conf, FILES, {}, {}, {}, w, 'init', undefined)
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
