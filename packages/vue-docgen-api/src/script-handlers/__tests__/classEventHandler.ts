import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import babylon from '../../babel-parser'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import classEventHandler from '../classEventHandler'
import Documentation, { EventDescriptor } from '../../Documentation'

jest.mock('../../Documentation')

function parse(src: string): { component: NodePath | undefined; ast: bt.File } {
	const ast = babylon({ plugins: ['typescript'] }).parse(src)
	return { component: resolveExportedComponent(ast)[0].get('default'), ast }
}

describe('classEventHandler', () => {
	let documentation: Documentation
	let mockEventDescriptor: EventDescriptor

	beforeEach(() => {
		mockEventDescriptor = { name: 'success' }
		documentation = new Documentation('dummy/path')
		const mockGetEventDescriptor = documentation.getEventDescriptor as jest.Mock
		mockGetEventDescriptor.mockReturnValue(mockEventDescriptor)
	})

	it('should find events emmitted', () => {
		const src = `
	import { Vue, Component, Emit } from "vue-property-decorator";
	
	@Component
	export default class Demo extends Vue {
		/**
		 * Describe the event
		 * @property {number} prop1
		 */
		@Emit()
		success() {
			return 1;
		}
	}
    `
		const def = parse(src)
		if (def.component) {
			classEventHandler(documentation, def.component, def.ast)
		}
		const eventComp: EventDescriptor = {
			name: 'success',
			description: 'Describe the event',
			properties: [
				{
					name: 'prop1',
					type: {
						names: ['number']
					}
				}
			]
		}
		expect(documentation.getEventDescriptor).toHaveBeenCalledWith('success')
		expect(mockEventDescriptor).toMatchObject(eventComp)
	})

	it('should find events emmitted whose name is specified', () => {
		const src = `
	import { Vue, Component, Emit } from "vue-property-decorator";
	
	@Component
	export default class Demo extends Vue {
		/**
		 * This is a demo event
		 * @property {number} demo
		 */
		@Emit("demoEvent")
		success() {
			return 1;
		}
	}
    `
		const def = parse(src)
		if (def.component) {
			classEventHandler(documentation, def.component, def.ast)
		}
		const eventComp: EventDescriptor = {
			name: 'success',
			description: 'This is a demo event',
			properties: [
				{
					name: 'demo',
					type: {
						names: ['number']
					}
				}
			]
		}
		expect(documentation.getEventDescriptor).toHaveBeenCalledWith('demoEvent')
		expect(mockEventDescriptor).toMatchObject(eventComp)
	})
})
