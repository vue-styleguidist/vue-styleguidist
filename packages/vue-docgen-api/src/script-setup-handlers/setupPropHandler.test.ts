import { ParserPlugin } from '@babel/parser'
import { expect } from 'vitest'
import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import babylon from '../babel-parser'
import resolveExportedComponent from '../utils/resolveExportedComponent'
import Documentation, { PropDescriptor } from '../Documentation'
import setupPropHandler from './setupPropHandler'

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
		documentation = new Documentation('test/path')
		const mockGetPropDescriptor = vi.spyOn(documentation, 'getPropDescriptor')
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
				{
				  "description": "",
				  "name": "mockProp",
				  "tags": {},
				  "type": {
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
				{
				  "description": "Should the prop be tested?",
				  "name": "mockProp",
				  "tags": {},
				  "type": {
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
				{
				  "description": "Should the prop be required?",
				  "name": "mockProp",
				  "required": true,
				  "tags": {},
				  "type": {
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
				{
				  "description": "Should the prop be required?",
				  "name": "mockProp",
				  "required": true,
				  "tags": {},
				  "type": {
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
				expect(prop.type).toMatchObject({
					name: 'boolean'
				})
			})

			it('should resolve props in defineProps union type arguments', async () => {
				const src = `
					defineProps<{
						testProps: string | number
					}>()
					`
				const prop = await parserTest(src)
				expect(documentation.getPropDescriptor).toHaveBeenCalledWith('testProps')
				expect(prop.type).toMatchObject({
					name: 'string | number'
				})
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
				expect(prop.type).toMatchInlineSnapshot(`
					{
					  "elements": [
					    {
					      "name": "number",
					    },
					  ],
					  "name": "Array",
					}
				`)
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
				expect(prop.type).toMatchObject({
					name: `{
    foo: number
    bar: boolean
}`
				})
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

			it('show prop type names when they are defined elsewhere', async () => {
				const src = `
					interface LocalType {
            /**
             * describe the local prop
             */
						inInterface: boolean
					}

					defineProps<{param:LocalType}>()
					`
				const prop = await parserTest(src)
				expect(documentation.getPropDescriptor).toHaveBeenCalledWith('param')
				expect(prop.type).toMatchObject({ name: 'LocalType' })
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
