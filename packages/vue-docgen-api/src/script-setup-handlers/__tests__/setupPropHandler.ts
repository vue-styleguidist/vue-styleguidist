import { ParserPlugin } from '@babel/parser'
import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import babylon from '../../babel-parser'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import Documentation, { PropDescriptor } from '../../Documentation'
import setupPropHandler from '../setupPropHandler'

jest.mock('../../Documentation')

function parse(src: string, plugins?: ParserPlugin[]): bt.File {
	return babylon({ plugins }).parse(src)
}

describe('setupPropHandler', () => {
	let documentation: Documentation
	let mockPropDescriptor: PropDescriptor

	let stubNodePath: NodePath<any, any> | undefined
	const options = { filePath: '', validExtends: () => true }
	beforeAll(() => {
		const defaultAST = babylon({ plugins: ['typescript'] }).parse('export default {}')
		stubNodePath = resolveExportedComponent(defaultAST)[0]?.get('default')
	})

	beforeEach(() => {
		mockPropDescriptor = {
			description: '',
			tags: {},
			name: 'mockProp'
		}
		const MockDocumentation = require('../../Documentation').default
		documentation = new MockDocumentation('test/path')
		const mockGetPropDescriptor = documentation.getPropDescriptor as jest.Mock
		mockGetPropDescriptor.mockReturnValue(mockPropDescriptor)
	})

	async function parserTest(
		src: string,
		plugins: ParserPlugin[] = ['typescript']
	): Promise<PropDescriptor> {
		const ast = parse(src, plugins)
		if (ast) {
			await setupPropHandler(documentation, stubNodePath as NodePath<any, any>, ast, options)
		}
		return mockPropDescriptor
	}

	describe('JavaScript', () => {
		it('should resolve props in defineProps', async () => {
			const src = `
				defineProps({
					testProps: Boolean
				})
				`
			const prop = await parserTest(src)
			expect(documentation.getPropDescriptor).toHaveBeenCalledWith('testProps')
			expect(prop).toMatchInlineSnapshot(`
			Object {
			  "description": "",
			  "name": "mockProp",
			  "tags": Object {},
			  "type": Object {
			    "name": "boolean",
			  },
			}
		`)
		})

		it('should resolve props comments in defineProps', async () => {
			const src = `
				defineProps({
					/**
					 * Should the prop be tested?
					 */
					testProps: Boolean
				})
				`
			const prop = await parserTest(src)
			expect(prop).toMatchInlineSnapshot(`
			Object {
			  "description": "Should the prop be tested?",
			  "name": "mockProp",
			  "tags": Object {},
			  "type": Object {
			    "name": "boolean",
			  },
			}
		`)
		})

		it('should resolve advanced props in defineProps', async () => {
			const src = `
				defineProps({
					/**
					 * Should the prop be required?
					 */
					testProps: {
						type: Boolean,
						required: true
					}
				})
				`
			const prop = await parserTest(src)
			expect(prop).toMatchInlineSnapshot(`
			Object {
			  "description": "Should the prop be required?",
			  "name": "mockProp",
			  "required": true,
			  "tags": Object {},
			  "type": Object {
			    "name": "boolean",
			  },
			}
		`)
		})

		it('matches defineProps inside of withDefaults', async () => {
			const src = `
      withDefaults(defineProps({
					/**
					 * Should the prop be required?
					 */
					testProps: {
						type: Boolean,
						required: true
					}
				}), {})
				`
			const prop = await parserTest(src)
			expect(prop).toMatchInlineSnapshot(`
			Object {
			  "description": "Should the prop be required?",
			  "name": "mockProp",
			  "required": true,
			  "tags": Object {},
			  "type": Object {
			    "name": "boolean",
			  },
			}
		`)
		})
	})

	describe('TypeScript', () => {
		describe('literal object', () => {
			it('should resolve props in defineProps type arguments', async () => {
				const src = `
					defineProps<{
						testProps: boolean,
						anotherTestProps: boolean
					}>()
					`
				const prop = await parserTest(src)
				expect(documentation.getPropDescriptor).toHaveBeenCalledWith('testProps')
				expect(documentation.getPropDescriptor).toHaveBeenCalledWith('anotherTestProps')
				expect(prop).toMatchInlineSnapshot(`
			Object {
			  "description": "",
			  "name": "mockProp",
			  "required": true,
			  "tags": Object {},
			  "type": undefined,
			}
		`)
			})

			it('should resolve comments in defineProps', async () => {
				const src = `
					defineProps<{
						/**
						 * A very nice prop
						 */
						anotherTestProps: boolean
					}>()
					`
				const prop = await parserTest(src)
				expect(documentation.getPropDescriptor).toHaveBeenCalledWith('anotherTestProps')
				expect(prop.description).toBe('A very nice prop')
			})

			it('shows optional fields as non-required props', async () => {
				const src = `
					defineProps<{
						optional?: boolean
					}>()
					`
				const prop = await parserTest(src)
				expect(documentation.getPropDescriptor).toHaveBeenCalledWith('optional')
				expect(prop.required).toBe(false)
			})

			it('shows non optional fields as required props', async () => {
				const src = `
					defineProps<{
						required: boolean
					}>()
					`
				const prop = await parserTest(src)
				expect(documentation.getPropDescriptor).toHaveBeenCalledWith('required')
				expect(prop.required).toBe(true)
			})

			it('resolves arrays', async () => {
				const src = `
					defineProps<{
						arrays: number[]
					}>()
					`
				const prop = await parserTest(src)
				expect(documentation.getPropDescriptor).toHaveBeenCalledWith('arrays')
				expect(prop.type).toMatchInlineSnapshot(`undefined`)
			})

			it('returns complex types', async () => {
				const src = `
					defineProps<{
						complex: {
              /**
               * foo is one part of the prop
               */
							foo: number,
              /**
               * bar is the other part
               */
							bar: boolean
						}
					}>()
					`
				const prop = await parserTest(src)
				expect(documentation.getPropDescriptor).toHaveBeenCalledWith('complex')
				expect(prop.type).toMatchInlineSnapshot(`undefined`)
			})
		})

		describe('local interfaces and types', () => {
			it('resolves local interfaces', async () => {
				const src = `
					interface LocalType {
            /**
             * describe the local prop
             */
						inInterface: boolean
					}

					defineProps<LocalType>()
					`
				const prop = await parserTest(src)
				expect(documentation.getPropDescriptor).toHaveBeenCalledWith('inInterface')
				expect(prop.required).toBe(true)
				expect(prop.description).toBe('describe the local prop')
			})
		})

		it('extracts defaults from withDefaults', async () => {
			const src = `
      withDefaults(defineProps<{
					/**
					 * Should the prop be required?
					 */
					testProp?: { myValue: boolean }
				}>(), {
          testProp: { myValue: true }
        })
				`
			const prop = await parserTest(src)
			expect(prop.defaultValue && prop.defaultValue.value).toContain(`myValue: true`)
		})
	})
})
