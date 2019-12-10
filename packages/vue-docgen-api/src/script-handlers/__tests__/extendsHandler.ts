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
	const doc = new Documentation()
	beforeEach(() => {
		resolveRequiredMock = (<unknown>resolveRequired) as jest.Mock<
			(ast: bt.File, varNameFilter?: string[]) => { [key: string]: string }
		>
		resolveRequiredMock.mockReturnValue({
			testComponent: { filePath: './componentPath', exportName: 'default' }
		})

		mockResolvePathFrom = (<unknown>resolvePathFrom) as jest.Mock<
			(path: string, from: string) => string
		>
		mockResolvePathFrom.mockReturnValue('./component/full/path')

		mockParse = parseFile as jest.Mock
		mockParse.mockReturnValue({ component: 'documentation' })
	})

	function parseItExtends(src: string) {
		const ast = babylon().parse(src)
		const path = resolveExportedComponent(ast).get('default')
		if (path) {
			extendsHandler(doc, path, ast, {
				filePath: '',
				validExtends: (fullFilePath: string) => !/[\\/]node_modules[\\/]/.test(fullFilePath)
			})
		}
	}

	it('should resolve extended modules variables in import default', () => {
		const src = [
			'import testComponent from "./testComponent"',
			'export default {',
			'  extends:testComponent',
			'}'
		].join('\n')
		parseItExtends(src)
		expect(parseFile).toHaveBeenCalledWith(
			expect.objectContaining({
				filePath: './component/full/path',
				nameFilter: ['default']
			}),
			doc
		)
	})

	it('should resolve extended modules variables in require', () => {
		const src = [
			'const testComponent = require("./testComponent");',
			'export default {',
			'  extends:testComponent',
			'}'
		].join('\n')
		parseItExtends(src)
		expect(parseFile).toHaveBeenCalledWith(
			expect.objectContaining({
				filePath: './component/full/path',
				nameFilter: ['default']
			}),
			doc
		)
	})

	it('should resolve extended modules variables in import', () => {
		const src = [
			'import { test as testComponent, other } from "./testComponent"',
			'export default {',
			'  extends:testComponent',
			'}'
		].join('\n')
		parseItExtends(src)
		expect(parseFile).toHaveBeenCalledWith(
			expect.objectContaining({
				filePath: './component/full/path',
				nameFilter: ['default']
			}),
			doc
		)
	})

	it('should resolve extended modules variables in class style components', () => {
		const src = [
			'import { testComponent } from "./testComponent";',
			'@Component',
			'export default class Bart extends testComponent {',
			'}'
		].join('\n')
		parseItExtends(src)
		expect(parseFile).toHaveBeenCalledWith(
			expect.objectContaining({
				filePath: './component/full/path',
				nameFilter: ['default']
			}),
			doc
		)
	})
})
