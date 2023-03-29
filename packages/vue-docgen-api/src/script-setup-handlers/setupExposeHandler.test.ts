import { ParserPlugin } from '@babel/parser'
import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import babylon from '../babel-parser'
import Documentation, { ExposeDescriptor } from '../Documentation'
import resolveExportedComponent from '../utils/resolveExportedComponent'
import setupExposedHandler from './setupExposeHandler'

function parse(src: string, plugins?: ParserPlugin[]): bt.File {
	return babylon({ plugins }).parse(src)
}

describe('setupExposedHandler', () => {
	let documentation: Documentation
	let mockExposeDescriptor: ExposeDescriptor

	let stubNodePath: NodePath<any, any> | undefined
	const options = { filePath: '', validExtends: () => true }
	beforeAll(() => {
		const defaultAST = babylon({ plugins: ['typescript'] }).parse('export default {}')
		stubNodePath = resolveExportedComponent(defaultAST)[0]?.get('default')
	})

	beforeEach(() => {
		mockExposeDescriptor = {
			description: '',
			name: 'mockExposed'
		}
		documentation = new Documentation('test/path')
		const mockGetPropDescriptor = vi.spyOn(documentation, 'getExposeDescriptor')
		mockGetPropDescriptor.mockReturnValue(mockExposeDescriptor)
	})

	async function parserTest(
		src: string,
		plugins: ParserPlugin[] = ['typescript']
	): Promise<ExposeDescriptor> {
		const ast = parse(src, plugins)
		await setupExposedHandler(documentation, stubNodePath!, ast, options)
		return mockExposeDescriptor
	}

  it('should resolve Exposed in setup script as an array of strings', async () => {
		const src = `
        const testProps = 0
        defineExpose([
          /**
           * Exposed test props
           */
          "testProps"
        ])
        `
    const exposed = await parserTest(src)
		expect(documentation.getExposeDescriptor).toHaveBeenCalledWith('testProps')
    expect(exposed).toMatchInlineSnapshot(`
			{
			  "description": "Exposed test props",
			  "name": "mockExposed",
			}
		`)
	})

	it('should resolve Exposed in setup script', async () => {
		const src = `
        const testProps = 0
        defineExpose({ testProps })
        `
		await parserTest(src)
		expect(documentation.getExposeDescriptor).toHaveBeenCalledWith('testProps')
	})

	it('should resolve Exposed descriptions in setup script', async () => {
		const src = `
        const testPropsInner = 0
        defineExpose({
          /**
           * Exposed test props
           */
          testProps: testPropsInner
        })
        `
		const prop = await parserTest(src)
		expect(prop).toMatchInlineSnapshot(`
			{
			  "description": "Exposed test props",
			  "name": "mockExposed",
			}
		`)
	})

	it('should resolve Exposed items pushed by strings', async () => {
		const src = `
        const testPropsInner = 0
        defineExpose({
          /**
           * Exposed test props
           */
          'testProps': testPropsInner
        })
        `
		const prop = await parserTest(src)
		expect(prop).toMatchInlineSnapshot(`
			{
			  "description": "Exposed test props",
			  "name": "mockExposed",
			}
		`)
	})
})
