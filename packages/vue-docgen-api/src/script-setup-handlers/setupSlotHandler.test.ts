import { ParserPlugin } from '@babel/parser'
import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import babylon from '../babel-parser'
import resolveExportedComponent from '../utils/resolveExportedComponent'
import Documentation, { SlotDescriptor } from '../Documentation'
import setupSlotHandler from './setupSlotHandler'

function parse(src: string, plugins?: ParserPlugin[]): bt.File {
	return babylon({ plugins }).parse(src)
}

describe('setupSlotHandler', () => {
	let documentation: Documentation
	let mockSlotDescriptor: SlotDescriptor

	let stubNodePath: NodePath<any, any> | undefined
	const options = { filePath: '', validExtends: () => true }
	beforeAll(() => {
		const defaultAST = babylon({ plugins: ['typescript'] }).parse('export default {}')
		stubNodePath = resolveExportedComponent(defaultAST)[0]?.get('default')
	})

	beforeEach(() => {
		mockSlotDescriptor = {
			description: '',
			tags: {},
			name: 'mockSlot'
		}
		documentation = new Documentation('test/path')
		const mockGetPropDescriptor = vi.spyOn(documentation, 'getSlotDescriptor')
		mockGetPropDescriptor.mockReturnValue(mockSlotDescriptor)
	})

	async function parserTest(
		src: string,
		plugins: ParserPlugin[] = ['typescript']
	): Promise<SlotDescriptor> {
		const ast = parse(src, plugins)
		if (ast) {
			await setupSlotHandler(documentation, stubNodePath as NodePath<any, any>, ast, options)
		}
		return mockSlotDescriptor
	}

	it('should return the correct name', async () => {
		const name = 'mockName'
		const slotDescriptor = await parserTest(`
			defineSlots<{
				${name}(): any
			}>()`)
		expect(slotDescriptor.name).toEqual(name)
	})

	it('should return the correct description', async () => {
		const description = 'the description expected'
		const slotDescriptor = await parserTest(`
			defineSlots<{
				/**
				 * ${description}
				 */
				test(): any
			}>()`)
		expect(slotDescriptor.description).toEqual(description)
	})

	it('should parse the proper bindings', async () => {
		const slotDescriptor = await parserTest(`
			defineSlots<{
				test(bindings: {
					/**
					 * the id of the slot
					 */
					id: number,
					/**
					 * this is a label
					 */
					label: string,
				}): any
			}>()`)
		expect(slotDescriptor.bindings).toMatchInlineSnapshot(`
			[
			  {
			    "description": "the id of the slot",
			    "name": "id",
			    "title": "binding",
			  },
			  {
			    "description": "this is a label",
			    "name": "label",
			    "title": "binding",
			  },
			]
		`)
	})
})
