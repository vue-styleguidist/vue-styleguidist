import * as bt from '@babel/types'
import babylon from '../../babel-parser'
import Documentation from '../../Documentation'
import { parseFile } from '../../parse'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import resolvePathFrom from '../../utils/resolvePathFrom'
import resolveRequired from '../../utils/resolveRequired'
import extendsHandler from '../extendsHandler'

jest.mock('../../utils/resolveRequired')
jest.mock('../../utils/resolvePathFrom')
jest.mock('../../parse')

describe('extendsHandler', () => {
	let resolveRequiredMock: jest.Mock
	let mockResolvePathFrom: jest.Mock
	let mockParse: jest.Mock
	const doc = new Documentation('dummy/path')
	beforeEach(() => {
		resolveRequiredMock = (resolveRequired as unknown) as jest.Mock<
			(ast: bt.File, varNameFilter?: string[]) => { [key: string]: string }
		>
		resolveRequiredMock.mockReturnValue({
			testComponent: { filePath: ['./componentPath'], exportName: 'default' }
		})

		mockResolvePathFrom = (resolvePathFrom as unknown) as jest.Mock<
			(path: string, from: string) => string
		>
		mockResolvePathFrom.mockReturnValue('./component/full/path')

		mockParse = parseFile as jest.Mock
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

	it('should resolve extended modules variables in import default', async () => {
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
