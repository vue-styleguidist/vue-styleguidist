import { ParserPlugin } from '@babel/parser'
import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import babylon from '../babel-parser'
import Documentation from '../Documentation'
import resolveExportedComponent from '../utils/resolveExportedComponent'
import setupOptionsHandler from './setupOptionsHandler'

function parse(src: string, plugins?: ParserPlugin[]): bt.File {
	return babylon({ plugins }).parse(src)
}

describe('setupOptionsHandler', () => {
	let documentation: Documentation

	let stubNodePath: NodePath<any, any> | undefined
	const options = { filePath: '', validExtends: () => true }
	beforeAll(() => {
		const defaultAST = babylon({ plugins: ['typescript'] }).parse('export default {}')
		stubNodePath = resolveExportedComponent(defaultAST)[0]?.get('default')
	})

	beforeEach(() => {
		documentation = new Documentation('test/path')
	})

	async function parserTest(src: string, plugins: ParserPlugin[] = ['typescript']) {
		const ast = parse(src, plugins)
		await setupOptionsHandler(documentation, stubNodePath!, ast, options)
	}

	it('should resolve name from defineOptions', async () => {
		const src = `
        const testProps = 0
        defineOptions({
          /**
           * Overridden component name
           */
          name: "testName"
        })
        `
		await parserTest(src)
		expect(documentation.get('name')).toEqual('testName')
	})
})
