import * as bt from '@babel/types'
import babelParser from '../../babel-parser'
import Documentation from '../../Documentation'
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
			testComponent: { filePath: ['componentPath'], exportName: 'default' }
		})

		mockResolvePathFrom = (<unknown>resolvePathFrom) as jest.Mock<
			(path: string, from: string) => string
		>
		mockResolvePathFrom.mockReturnValue('./component/full/path')

		mockParse = parseFile as jest.Mock
		mockParse.mockReset()
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
	])('should resolve extended modules variables', async (src, done) => {
		const ast = babelParser().parse(src)
		const path = resolveExportedComponent(ast).get('default')
		if (path) {
			await mixinsHandler(doc, path, ast, {
				filePath: '',
				validExtends: (fullFilePath: string) => !/[\\/]node_modules[\\/]/.test(fullFilePath)
			})
		}
		expect(mockParse).toHaveBeenCalledWith(
			expect.objectContaining({
				filePath: './component/full/path',
				nameFilter: ['default']
			}),
			doc
		)
		done()
	})

	it('should resolve mixins modules variables in class style components', async done => {
		const src = [
			'import { testMixin, otherMixin  } from "./mixins";',
			'@Component',
			'export default class Bart extends mixins(testMixins, otherMixin) {',
			'}'
		].join('\n')
		const ast = babelParser().parse(src)
		const path = resolveExportedComponent(ast).get('default')
		if (!path) {
			done.fail()
			return
		}
		await mixinsHandler(doc, path, ast, {
			filePath: '',
			validExtends: (fullFilePath: string) => !/[\\/]node_modules[\\/]/.test(fullFilePath)
		})
		expect(mockParse).toHaveBeenCalledWith(
			expect.objectContaining({
				filePath: './component/full/path',
				nameFilter: ['default']
			}),
			doc
		)
		done()
	})

	it('should ignore mixins coming from node_modules', async done => {
		const src = [
			'import { VueMixin  } from "vue-mixins";',
			'export default {',
			'  mixins:[VueMixin]',
			'}'
		].join('\n')
		const ast = babelParser().parse(src)
		const path = resolveExportedComponent(ast).get('default')
		if (!path) {
			done.fail()
			return
		}
		mockResolvePathFrom.mockReturnValue('foo/node_modules/component/full/path')
		await mixinsHandler(doc, path, ast, {
			filePath: '',
			validExtends: (fullFilePath: string) => !/[\\/]node_modules[\\/]/.test(fullFilePath)
		})
		expect(mockParse).not.toHaveBeenCalled()
		done()
	})

	it('should ignore variables that are not mixins', async done => {
		const src = [
			'const { maxin } = require("./maxins");',
			'const foo = require("./bar")',
			'export default {',
			'  name: "boo"',
			'}'
		].join('\n')
		const ast = babelParser().parse(src)
		const path = resolveExportedComponent(ast).get('default')
		if (!path) {
			done.fail()
			return
		}
		await mixinsHandler(doc, path, ast, {
			filePath: '',
			validExtends: (fullFilePath: string) => !/[\\/]node_modules[\\/]/.test(fullFilePath)
		})
		expect(mockParse).not.toHaveBeenCalled()
		done()
	})
})
