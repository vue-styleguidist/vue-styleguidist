import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import { SpyInstance } from 'vitest'
import babylon from '../babel-parser'
import Documentation, { EventDescriptor } from '../Documentation'
import resolveExportedComponent from '../utils/resolveExportedComponent'
import eventHandler, { eventHandlerEmits } from './eventHandler'

vi.mock('../../Documentation')

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
    vi.spyOn(documentation, 'getEventDescriptor')
		const mockGetEventDescriptor = documentation.getEventDescriptor as any as SpyInstance
		mockGetEventDescriptor.mockReturnValue(mockEventDescriptor)
	})

	it('should find events emitted', () => {
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

	it('should find events whose names are only specified in the JSDoc', () => {
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

	it('should allow forced events', () => {
		const src = `
	export default {
		methods: {
			/** 
			 * Define the event just before the function block
			 *
			 * @event updating
			 * @property { String } prop1 - first prop given by the event
			 */
      /** 
       * Define each event in its own block
       *
       * @event sending
       * @property { String } sendingProp - first prop given by the event
       */
			/** 
			 * @fires updating
       * @fires sending
       */
			onUpdate (name, newValue) {
				// some external method, for example from a method
				// (bind to the Vue instance) provided by a standard js class
			}
		}	
	}`
		const def = parse(src)
		if (def.component) {
			eventHandler(documentation, def.component, def.ast)
		}
		expect(documentation.getEventDescriptor).toHaveBeenCalledWith('updating')
		expect(documentation.getEventDescriptor).toHaveBeenCalledWith('sending')
	})

	describe('vue 3 event descriptors', () => {
		it('should detect events as an array', () => {
			const src = `
	export default {
		emits: ['in-focus', 'submit']
	}
			`
			const def = parse(src)
			if (def.component) {
				eventHandlerEmits(documentation, def.component)
			}
			expect(documentation.getEventDescriptor).toHaveBeenCalledWith('in-focus')
			expect(documentation.getEventDescriptor).toHaveBeenCalledWith('submit')
		})

		it('should detect event descriptors as an object', () => {
			const src = `
	export default {
		emits: {
			'in-focus': undefined, 
			submit: undefined
		}
	}
			`
			const def = parse(src)
			if (def.component) {
				eventHandlerEmits(documentation, def.component)
			}
			expect(documentation.getEventDescriptor).toHaveBeenCalledWith('in-focus')
			expect(documentation.getEventDescriptor).toHaveBeenCalledWith('submit')
		})

		it('should extract desciptions (array)', () => {
			const src = `
	export default {
		emits: [
			/**
			 * The button has gathered focus
			 */
			'in-focus', 
			/**
			 * The form is being submitted
			 */
			'submit'
		]
	}
			`
			const def = parse(src)
			if (def.component) {
				eventHandlerEmits(documentation, def.component)
			}
			const eventComp: EventDescriptor = {
				name: 'success',
				description: 'The form is being submitted'
			}
			expect(mockEventDescriptor).toMatchObject(eventComp)
		})

		it('should extract desciptions (object)', () => {
			const src = `
	export default {
		emits: {
			/**
			 * The button has gathered focus
			 */
			'in-focus': undefined, 
			/**
			 * The form is being submitted
			 */
			submit: undefined
		}
	}
			`
			const def = parse(src)
			if (def.component) {
				eventHandlerEmits(documentation, def.component)
			}
			const eventComp: EventDescriptor = {
				name: 'success',
				description: 'The form is being submitted'
			}
			expect(mockEventDescriptor).toMatchObject(eventComp)
		})

		it('should extract arguments (array)', () => {
			const src = `
	export default {
		emits: [
			'click',
			/**
			 * The form is being submitted
			 * @arg {string} payload
			 */
			'submit'
		]
	}
			`
			const def = parse(src)
			if (def.component) {
				eventHandlerEmits(documentation, def.component)
			}
			const eventComp: EventDescriptor = {
				name: 'success',
				description: 'The form is being submitted',
				properties: [
					{
						name: 'payload',
						type: {
							names: ['string']
						}
					}
				]
			}
			expect(mockEventDescriptor).toMatchObject(eventComp)
		})
	})
})
