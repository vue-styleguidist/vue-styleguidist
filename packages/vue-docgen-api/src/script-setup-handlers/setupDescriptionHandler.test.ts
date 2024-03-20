import { ParserPlugin } from '@babel/parser'
import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import babylon from '../babel-parser'
import resolveExportedComponent from '../utils/resolveExportedComponent'
import Documentation, { EventDescriptor } from '../Documentation'
import setupDescriptionHandler from './setupDescriptionHandler'

function parse(src: string, plugins?: ParserPlugin[]): bt.File {
	return babylon({ plugins }).parse(src)
}

describe.only('setupDescriptionHandler', () => {
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

	async function parserTest(
		src: string,
		plugins: ParserPlugin[] = ['typescript']
	): Promise<EventDescriptor> {
		const ast = parse(src, plugins)
		await setupDescriptionHandler(documentation, stubNodePath!, ast, options)
		return documentation.get('description');
	}

	it('should resolve description', async () => {
		const src = `
			/** 
			 * @description This is a test component 
			 */
			export default {}
			`
		const description = await parserTest(src)
		expect(description).toEqual('This is a test component')
	});
})
