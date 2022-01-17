import { ParserPlugin } from '@babel/parser'
import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import babylon from '../../babel-parser'
import Documentation, { ExposedDescriptor } from '../../Documentation'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import setupExposedHandler from '../setupExposedHandler'

jest.mock('../../Documentation')

function parse(src: string, plugins?: ParserPlugin[]): bt.File {
	return babylon({ plugins }).parse(src)
}

describe('setupExposedHandler', () => {
	let documentation: Documentation
	let mockExposedDescriptor: ExposedDescriptor

	let stubNodePath: NodePath<any, any> | undefined
	const options = { filePath: '', validExtends: () => true }
	beforeAll(() => {
		const defaultAST = babylon({ plugins: ['typescript'] }).parse('export default {}')
		stubNodePath = resolveExportedComponent(defaultAST)[0]?.get('default')
	})

	beforeEach(() => {
		mockExposedDescriptor = {
			description: '',
			name: 'mockExposed'
		}
		const MockDocumentation = require('../../Documentation').default
		documentation = new MockDocumentation('test/path')
		const mockGetPropDescriptor = documentation.getExposedDescriptor as jest.Mock
		mockGetPropDescriptor.mockReturnValue(mockExposedDescriptor)
	})

	async function parserTest(
		src: string,
		plugins: ParserPlugin[] = ['typescript']
	): Promise<ExposedDescriptor> {
		const ast = parse(src, plugins)
		await setupExposedHandler(documentation, stubNodePath!, ast, options)
		return mockExposedDescriptor
	}

	it('should resolve Exposed in setup script', async () => {
		const src = `
        const testProps = 0
        defineExposed({ testProps })
        `
		await parserTest(src)
		expect(documentation.getExposedDescriptor).toHaveBeenCalledWith('testProps')
	})

	it('should resolve Exposed descriptions in setup script', async () => {
		const src = `
        const testPropsInner = 0
        defineExposed({
          /**
           * Exposed test props
           */
          testProps: testPropsInner
        })
        `
		const prop = await parserTest(src)
		expect(prop).toMatchInlineSnapshot(`
		Object {
		  "description": "Exposed test props",
		  "name": "mockExposed",
		}
	`)
	})

	it('should resolve Exposed items pushed by strings', async () => {
		const src = `
        const testPropsInner = 0
        defineExposed({
          /**
           * Exposed test props
           */
          'testProps': testPropsInner
        })
        `
		const prop = await parserTest(src)
		expect(prop).toMatchInlineSnapshot(`
		Object {
		  "description": "Exposed test props",
		  "name": "mockExposed",
		}
	`)
	})
})
