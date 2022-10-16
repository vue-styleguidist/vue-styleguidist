import { ParserPlugin } from '@babel/parser'
import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import babylon from '../babel-parser'
import resolveExportedComponent from '../utils/resolveExportedComponent'
import Documentation, { EventDescriptor } from '../Documentation'
import setupEventHandler from './setupEventHandler'

function parse(src: string, plugins?: ParserPlugin[]): bt.File {
	return babylon({ plugins }).parse(src)
}

describe('setupEventHandler', () => {
	let documentation: Documentation
	let mockEventDescriptor: EventDescriptor

	let stubNodePath: NodePath<any, any> | undefined
	const options = { filePath: '', validExtends: () => true }
	beforeAll(() => {
		const defaultAST = babylon({ plugins: ['typescript'] }).parse('export default {}')
		stubNodePath = resolveExportedComponent(defaultAST)[0]?.get('default')
	})

	beforeEach(() => {
		mockEventDescriptor = {
			description: '',
			name: 'mockEvent'
		}
		documentation = new Documentation('test/path')
		const mockGetEventDescriptor = vi.spyOn(documentation, 'getEventDescriptor')
		mockGetEventDescriptor.mockReturnValue(mockEventDescriptor)
	})

	async function parserTest(
		src: string,
		plugins: ParserPlugin[] = ['typescript']
	): Promise<EventDescriptor> {
		const ast = parse(src, plugins)
		await setupEventHandler(documentation, stubNodePath!, ast, options)
		return mockEventDescriptor
	}

	describe('JavaScript', () => {
		it('should resolve emit from defineEmits function: Array', async () => {
			const src = `
          const emit = defineEmits([
            /**
             * this is a test event
             */ 
            'test'
          ])
          `
			const event = await parserTest(src)
			expect(documentation.getEventDescriptor).toHaveBeenCalledWith('test')
			expect(event).toMatchObject({
				description: 'this is a test event',
				name: 'mockEvent'
			})
		})

		it('should resolve emit from defineEmits function: Object', async () => {
			const src = `
          const emit = defineEmits({
            /**
             * no validation
             */
            test: null,
          })
          `
			const event = await parserTest(src)
			expect(documentation.getEventDescriptor).toHaveBeenCalledWith('test')
			expect(event).toMatchObject({
				description: 'no validation',
				name: 'mockEvent'
			})
		})

		it('should resolve emit: Object with validation', async () => {
			const src = `
          const emit = defineEmits({
            /**
             * with validation
             */
            submit: payload => {
              if (payload.email && payload.password) {
                return true
              } else {
                console.warn('Invalid submit event payload!')
                return false
              }
            }
          })
          `
			const event = await parserTest(src)
			expect(documentation.getEventDescriptor).toHaveBeenCalledWith('submit')
			expect(event).toMatchObject({
				description: 'with validation',
				name: 'mockEvent'
			})
		})
	})

	describe('TypeScript', () => {
		it('should resolve emit from defineEmits function types', async () => {
			const src = `
          const emit = defineEmits<{
            /**
             * Cancels everything
             */
            (event: 'cancel'): void
            /**
             * Save the world
             */
            (event: 'save'): void
          }>()
          `
			const event = await parserTest(src)
			expect(documentation.getEventDescriptor).toHaveBeenCalledWith('cancel')
			expect(documentation.getEventDescriptor).toHaveBeenCalledWith('save')
			expect(event).toMatchObject({
				description: 'Save the world',
				name: 'mockEvent'
			})
		})

		it('should resolve the types if they are local', async () => {
			const src = `
          interface EmitTypes {
            /**
             * Save the world
             */
            (event: 'save'): void
          }
          
          const emit = defineEmits<EmitTypes>()
          `
			const event = await parserTest(src)
			expect(documentation.getEventDescriptor).toHaveBeenCalledWith('save')
			expect(event).toMatchObject({
				description: 'Save the world',
				name: 'mockEvent'
			})
		})

		it('should deduce the type of event from the first arg', async () => {
			const src = `
          const emit = defineEmits<{
            (event: 'save', arg: number): void
          }>()
          `
			const event = await parserTest(src)
			expect(documentation.getEventDescriptor).toHaveBeenCalledWith('save')
			expect(event).toMatchObject({
				type: { names: ['number'] }
			})
		})

		it('should accept types that are complex', async () => {
			const src = `
          interface Format{
            email: string
          }

          const emit = defineEmits<{
            /**
             * Save the world
             * @arg {{ email: string }} payload - The payload
             */
            (event: 'save', payload: Format): void
          }>()
          `
			const event = await parserTest(src)
			expect(documentation.getEventDescriptor).toHaveBeenCalledWith('save')
			expect(event).toMatchObject({
				properties: [
					{
						description: 'The payload',
						name: 'payload',
						type: {
							names: ['{ email: string }']
						}
					}
				]
			})
		})
	})
})
