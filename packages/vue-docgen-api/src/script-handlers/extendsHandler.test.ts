import * as bt from '@babel/types'
import { SpyInstance } from 'vitest'
import babylon from '../babel-parser'
import Documentation from '../Documentation'
import { parseFile } from '../parse'
import resolveExportedComponent from '../utils/resolveExportedComponent'
import resolvePathFrom from '../utils/resolvePathFrom'
import resolveRequired from '../utils/resolveRequired'
import extendsHandler from './extendsHandler'

vi.mock('../utils/resolveRequired')
vi.mock('../utils/resolvePathFrom')
vi.mock('../parse')

describe('extendsHandler', () => {
	let resolveRequiredMock: SpyInstance<
    [ast: bt.File, varNameFilter?: string[]],
    { [key: string]: { filePath: string[], exportName: string } }
  >
	let mockResolvePathFrom: SpyInstance<
    [path: string, from: string],
     string
  >
	let mockParse: SpyInstance
	const doc = new Documentation('dummy/path')
	beforeEach(() => {
		resolveRequiredMock = (resolveRequired as any)
		resolveRequiredMock.mockReturnValue({
			testComponent: { filePath: ['./componentPath'], exportName: 'default' }
		})

		mockResolvePathFrom = (resolvePathFrom as any)
		mockResolvePathFrom.mockReturnValue('./component/full/path')

		mockParse = parseFile as any
		mockParse.mockReturnValue({ component: 'documentation' })
	})

	async function parseItExtends(src: string) {
		const ast = babylon().parse(src)
		const path = resolveExportedComponent(ast)[0].get('default')
		if (path) {
			await extendsHandler(doc, path, ast, {
				filePath: '',
				validExtends: (fullFilePath: string) => !/[\\/]node_modules[\\/]/.test(fullFilePath)
			})
		}
	}

	it.only('should resolve extended modules variables in import default', async () => {
		const src = [
			'import testComponent from "./testComponent"',
			'export default {',
			'  extends:testComponent',
			'}'
		].join('\n')
		await parseItExtends(src)
		expect(parseFile).toHaveBeenCalledWith(
			expect.objectContaining({
				filePath: './component/full/path',
				nameFilter: ['default']
			}),
			doc
		)
	})

	it('should resolve extended modules variables in require', async () => {
		const src = [
			'const testComponent = require("./testComponent");',
			'export default {',
			'  extends:testComponent',
			'}'
		].join('\n')
		await parseItExtends(src)
		expect(parseFile).toHaveBeenCalledWith(
			expect.objectContaining({
				filePath: './component/full/path',
				nameFilter: ['default']
			}),
			doc
		)
	})

	it('should resolve extended modules variables in import', async () => {
		const src = [
			'import { test as testComponent, other } from "./testComponent"',
			'export default {',
			'  extends:testComponent',
			'}'
		].join('\n')
		await parseItExtends(src)
		expect(parseFile).toHaveBeenCalledWith(
			expect.objectContaining({
				filePath: './component/full/path',
				nameFilter: ['default']
			}),
			doc
		)
	})

	it('should resolve extended modules variables in class style components', async () => {
		const src = [
			'import { testComponent } from "./testComponent";',
			'@Component',
			'export default class Bart extends testComponent {',
			'}'
		].join('\n')
		await parseItExtends(src)
		expect(parseFile).toHaveBeenCalledWith(
			expect.objectContaining({
				filePath: './component/full/path',
				nameFilter: ['default']
			}),
			doc
		)
	})
})
