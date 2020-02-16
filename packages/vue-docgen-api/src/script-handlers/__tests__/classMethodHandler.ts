import { NodePath } from 'ast-types'
import Map from 'ts-map'
import babylon from '../../babel-parser'
import Documentation, { MethodDescriptor } from '../../Documentation'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import classMethodHandler from '../classMethodHandler'

jest.mock('../../Documentation')

function parseTS(src: string): Map<string, NodePath> {
	const ast = babylon({ plugins: ['typescript'] }).parse(src)
	return resolveExportedComponent(ast)[0]
}

describe('classPropHandler', () => {
	let documentation: Documentation
	let mockMethodDescriptor: MethodDescriptor

	beforeEach(() => {
		mockMethodDescriptor = { name: '', description: '', modifiers: [] }
		const MockDocumentation = Documentation
		documentation = new MockDocumentation('test/path')
		const mockGetMethodDescriptor = documentation.getMethodDescriptor as jest.Mock
		mockGetMethodDescriptor.mockImplementation((name: string) => {
			mockMethodDescriptor.name = name
			return mockMethodDescriptor
		})
	})

	function tester(src: string, matchedObj: any) {
		const def = parseTS(src).get('default')
		if (def) {
			classMethodHandler(documentation, def)
		}
		expect(mockMethodDescriptor).toMatchObject(matchedObj)
	}

	it('should detect public methods', () => {
		const src = `
        @Component
        export default class MyComp {
          /**
           * @public
           */
          myMethod(){

          }
        }`
		tester(src, { name: 'myMethod' })
	})

	it('should detect public methods params', () => {
		const src = `
        @Component
        export default class MyComp {
          /**
           * @public
           */
          myMethod(param1){

          }
        }`
		tester(src, { name: 'myMethod', params: [{ name: 'param1' }] })
	})

	it('should detect public methods params with default values', () => {
		const src = `
        @Component
        export default class MyComp {
          /**
           * @public
           */
          myMethod(param1 = 2){

          }
        }`
		tester(src, { name: 'myMethod', params: [{ name: 'param1' }] })
	})

	it('should detect public methods params types', () => {
		const src = `
        @Component
        export default class MyComp {
          /**
           * @public
           */
          myMethod(param1: string){

          }
        }`
		tester(src, { name: 'myMethod', params: [{ name: 'param1', type: { name: 'string' } }] })
	})

	it('should detect public methods return types', () => {
		const src = `
        @Component
        export default class MyComp {
          /**
           * @public
           */
          myMethod(): number{
            return 1;
          }
        }`
		tester(src, { name: 'myMethod', returns: { type: { name: 'number' } } })
	})
})
