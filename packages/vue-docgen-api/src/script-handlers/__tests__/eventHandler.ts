import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import babylon from '../../babel-parser'
import Documentation, { EventDescriptor } from '../../Documentation'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import eventHandler from '../eventHandler'

jest.mock('../../Documentation')

function parse(src: string): { component: NodePath | undefined; ast: bt.File } {
	const ast = babylon().parse(src)
	return { component: resolveExportedComponent(ast)[0].get('default'), ast }
}

describe('eventHandler', () => {
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
    export default {
      methods: {
        testEmit() {
            /**
             * Describe the event
             * @property {number} prop1
             * @param {number} prop2
             */
            this.$emit('success', 1, 2)
        }
      }
    }
    `
		const def = parse(src)
		if (def.component) {
			eventHandler(documentation, def.component, def.ast)
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
				},
				{
					name: 'prop2',
					type: {
						names: ['number']
					}
				}
			]
		}
		expect(documentation.getEventDescriptor).toHaveBeenCalledWith('success')
		expect(mockEventDescriptor).toMatchObject(eventComp)
	})

	it('should find simple events emmitted', () => {
		const src = `
    export default {
      methods: {
        testEmit() {
            /**
             * Describe the event
             */
            this.$emit('success')
        }
      }
    }
    `
		const def = parse(src)
		if (def.component) {
			eventHandler(documentation, def.component, def.ast)
		}
		expect(mockEventDescriptor.properties).toBeUndefined()
	})

	it('should find events undocumented properties', () => {
		const src = `
    export default {
      methods: {
        testEmit() {
            this.$emit('success', 1, 2)
        }
      }
    }
    `
		const def = parse(src)
		if (def.component) {
			eventHandler(documentation, def.component, def.ast)
		}
		const eventComp: EventDescriptor = {
			name: 'success',
			type: {
				names: ['undefined']
			},
			properties: [
				{
					name: '<anonymous1>',
					type: {
						names: ['undefined']
					}
				}
			]
		}
		expect(documentation.getEventDescriptor).toHaveBeenCalledWith('success')
		expect(mockEventDescriptor).toMatchObject(eventComp)
	})

	it('should find events names stored in variables', () => {
		const src = `
    const successEventName = 'success';
    export default {
      methods: {
        testEmit() {
            this.$emit(successEventName, 1, 2)
        }
      }
    }
    `
		const def = parse(src)
		if (def.component) {
			eventHandler(documentation, def.component, def.ast)
		}
		expect(documentation.getEventDescriptor).toHaveBeenCalledWith('success')
	})

	it('should allow the use of an event multiple times', () => {
		const src = `
    export default {
      methods: {
        testEmit() {
			/**
			 * Describe the event
			 * @property {number} prop1
			 * @property {string} msg
			 */
			this.$emit('success', 3, "hello")
			this.$emit('success', 1)
        }
      }
    }
    `
		const def = parse(src)
		if (def.component) {
			eventHandler(documentation, def.component, def.ast)
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
				},
				{
					name: 'msg',
					type: {
						names: ['string']
					}
				}
			]
		}
		expect(mockEventDescriptor).toMatchObject(eventComp)
	})

	it('should find events whose names are only spcified in the JSDoc', () => {
		const src = `
    export default {
      methods: {
        testEmit() {
            /**
             * @event success
             */
            this.$emit(A.successEventName, 1, 2)
        }
      }
    }
    `
		const def = parse(src)
		if (def.component) {
			eventHandler(documentation, def.component, def.ast)
		}
		expect(documentation.getEventDescriptor).toHaveBeenCalledWith('success')
	})

	it('should not fail when event name cannot be found', () => {
		const src = `
    export default {
      methods: {
        testEmit(success) {
            this.$emit(success, 1, 2)
        }
      }
    }
		`
		const def = parse(src)
		expect(() => eventHandler(documentation, def.component as any, def.ast)).not.toThrow()
	})
})
