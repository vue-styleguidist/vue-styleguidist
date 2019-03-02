import * as bt from '@babel/types'
import babelParser from '../../babel-parser'
import { Documentation } from '../../Documentation'
import { parseFile } from '../../parse'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import resolvePathFrom from '../../utils/resolvePathFrom'
import resolveRequired from '../../utils/resolveRequired'
import mixinsHandler from '../mixinsHandler'

jest.mock('../../utils/resolveRequired')
jest.mock('../../utils/resolvePathFrom')
jest.mock('../../parse')

describe('mixinsHandler', () => {
	let resolveRequiredMock: jest.Mock
	let mockResolvePathFrom: jest.Mock
	let mockParse: jest.Mock
	const doc = new Documentation()
	beforeEach(() => {
		resolveRequiredMock = (<unknown>resolveRequired) as jest.Mock<
			(ast: bt.File, varNameFilter?: string[]) => { [key: string]: string }
		>
		resolveRequiredMock.mockReturnValue({
			testComponent: { filePath: 'componentPath', exportName: 'default' }
		})

		mockResolvePathFrom = (<unknown>resolvePathFrom) as jest.Mock<
			(path: string, from: string) => string
		>
		mockResolvePathFrom.mockReturnValue('./component/full/path')

		mockParse = parseFile as jest.Mock
		mockParse.mockReturnValue({ component: 'documentation' })
	})

	it.each([
		[
			'import testComponent from "./testComponent"',
			'export default {',
			'  mixins:[testComponent]',
			'}'
		].join('\n'),
		[
			'import { testComponent, other } from "./testComponent"',
			'export default {',
			'   mixins:[testComponent,other]',
			'}'
		].join('\n'),
		[
			'const testComponent = require("./testComponent");',
			'export default {',
			'  mixins:[testComponent,other]',
			'}'
		].join('\n')
	])('should resolve extended modules variables', src => {
		const ast = babelParser().parse(src)
		const path = resolveExportedComponent(ast).get('default')
		if (path) {
			mixinsHandler(doc, path, ast, { filePath: '' })
		}
		expect(parseFile).toHaveBeenCalledWith(doc, {
			filePath: './component/full/path',
			nameFilter: ['default']
		})
	})
})
