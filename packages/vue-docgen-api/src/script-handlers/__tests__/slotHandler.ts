import { NodePath } from 'ast-types'
import buildParser from '../../babel-parser'
import Documentation, { SlotDescriptor } from '../../Documentation'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import slotHandler from '../slotHandler'

jest.mock('../../Documentation')

function parse(src: string): NodePath | undefined {
	const ast = buildParser({ plugins: ['jsx'] }).parse(src)
	return resolveExportedComponent(ast)[0].get('default')
}

describe('render function slotHandler', () => {
	let documentation: Documentation
	let mockSlotDescriptor: SlotDescriptor

	beforeEach(() => {
		mockSlotDescriptor = { name: 'mySlot', description: '' }
		documentation = new Documentation('dummy/path')
		const mockGetSlotDescriptor = documentation.getSlotDescriptor as jest.Mock
		mockGetSlotDescriptor.mockReturnValue(mockSlotDescriptor)
	})

	it('should find slots in render function', async done => {
		const src = `
    export default {
      render: function (createElement) {
        return createElement('div', this.$slots.mySlot)
      }
    }
    `
		const def = parse(src)
		if (def) {
			await slotHandler(documentation, def)
		}
		expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('mySlot')
		done()
	})

	it('should find scoped slots in render function', async done => {
		const src = `
    export default {
      render: function (createElement) {
        return createElement('div', [
          this.$scopedSlots.myScopedSlot({
            text: this.message
          })
        ])
      }
    }
    `
		const def = parse(src)
		if (def) {
			await slotHandler(documentation, def)
		}
		expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('myScopedSlot')
		done()
	})

	it('should find scoped slots in render object method', async done => {
		const src = `
    export default {
      render(createElement) {
        return createElement('div', [
          this.$scopedSlots.myOtherScopedSlot({
            text: this.message
          })
        ])
      }
    }
    `
		const def = parse(src)
		if (def) {
			await slotHandler(documentation, def)
		}
		expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('myOtherScopedSlot')
		done()
	})

	it('should find slots in jsx render', async done => {
		const src = `
    export default {
      render(createElement) {
        return (<div>, 
          <slot name="myMain"/>
        </div>)
      }
    }
    `
		const def = parse(src)
		if (def) {
			await slotHandler(documentation, def)
		}
		expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('myMain')
		done()
	})

	it('should find default slots in jsx render', async done => {
		const src = `
    export default {
      render(createElement) {
        return (<div>, 
          <slot/>
        </div>)
      }
    }
    `
		const def = parse(src)
		if (def) {
			await slotHandler(documentation, def)
		}
		expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('default')
		done()
	})

	it('should allow describing slots in jsx render', async done => {
		const src = `
    export default {
      render(createElement) {
        return (<div>, 
          {/** @slot Use this slot header */}
          <slot/>
        </div>)
      }
    }
    `
		const def = parse(src)
		if (def) {
			await slotHandler(documentation, def)
		}
		expect(mockSlotDescriptor.description).toEqual('Use this slot header')
		done()
	})

	it('should allow describing slots in render', async done => {
		const src = `
    export default {
      render: function (createElement) {
        return createElement(
        	'div', 
        	/** @slot Use this slot header */
        	this.$slots.mySlot
        )
      }
    }
    `
		const def = parse(src)
		if (def) {
			await slotHandler(documentation, def)
		}

		expect(mockSlotDescriptor.description).toEqual('Use this slot header')
		done()
	})

	it('should allow describing scopedSlots in render', async done => {
		const src = `
      export default {
        render(h) {
          return h('div', [
            /** @slot It is the default slot */
            this.$scopedSlots.default(),
           ]);
         },
      };
  `
		const def = parse(src)
		if (def) {
			await slotHandler(documentation, def)
		}

		expect(mockSlotDescriptor.description).toEqual('It is the default slot')
		done()
	})

	it('should not fail if forEach is following usage of the slot', async done => {
		const src = `
      export default {
        render(h) {
			if (this.$slots.default) {
				this.$slots.default.forEach(() => {
				  console.log('foo');
				})
			}
			return h('hr');
		}
      };
  `
		const def = parse(src)
		if (def) {
			await slotHandler(documentation, def)
		}
		expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('default')
		done()
	})

	it('should detect scopedSlots in renderless components', async done => {
		const src = `
      export default {
        render () {
			/**
			 * @slot Use this slot carefully 
			 */
			return this.$scopedSlots.default({
			  /**
			   * contains true while compiling
			   */ 
			  compiling: this.compiling,
			  /**
			   * will render the compiled item
			   */ 
			  compile: this.compile
			})
		  }
      };
  `
		const def = parse(src)
		if (def) {
			await slotHandler(documentation, def)
		}
		expect(mockSlotDescriptor).toMatchInlineSnapshot(`
		Object {
		  "bindings": Array [
		    Object {
		      "description": "contains true while compiling",
		      "name": "compiling",
		      "title": "binding",
		    },
		    Object {
		      "description": "will render the compiled item",
		      "name": "compile",
		      "title": "binding",
		    },
		  ],
		  "description": "Use this slot carefully",
		  "name": "mySlot",
		}
	`)
		done()
	})

	it('should allow describing scoped slots in render', async done => {
		const src = `
    export default {
      render: function (createElement) {
        return createElement('div', {}, [/** @slot Use this slot header */this.$scopedSlots.mySlot])
      }
    }
    `
		const def = parse(src)
		if (def) {
			await slotHandler(documentation, def)
		}

		expect(mockSlotDescriptor.description).toEqual('Use this slot header')
		done()
	})

	it('should allow to assign slots to variables', async done => {
		const src = `
export default {
	render(h) {
	  const pending = this.pending
	  if (pending && this.$scopedSlots.pending) {
		/** @slot the content for the pending state */ 
		const pendingSlot = this.$scopedSlots.pending()
		return safeSlot(h, pendingSlot)
	  }
	  const error = this.error
	  if (!pending && error && this.$scopedSlots.rejected) {
		/** @slot the content for the pending state */ 
		const rejectSlot = this.$scopedSlots.rejected(error)
		return safeSlot(h, rejectSlot)
	  }
	  const results = this.results === undefined ? this.default : this.results
	  if (!pending && this.$scopedSlots.resolved) {
		/** @slot the content for the pending state */ 
		const resolveSlot = this.$scopedSlots.resolved(results)
		return safeSlot(h, resolveSlot)
	  }
	  if (!this.$scopedSlots.default) return
	  /** @slot the content for the pending state */ 
	  const defaultSlot = this.$scopedSlots.default({
		pending,
		results,
		error
	  })
	  return safeSlot(h, defaultSlot)
	}
}
	  `
		const def = parse(src)
		if (def) {
			await slotHandler(documentation, def)
		}
		expect(documentation.getSlotDescriptor).toHaveBeenCalledTimes(8)
		expect(mockSlotDescriptor.description).toEqual('the content for the pending state')
		done()
	})
	describe('tags', () => {
		it('should extract tags from the description block', async done => {
			const src = `
	export default {
	  render(createElement) {
		return createElement('div', [
			/**
			 * @slot 
			 * @ignore
			 */
			this.$scopedSlots.default
		])
	  }
	}
	`
			const def = parse(src)
			if (def) {
				await slotHandler(documentation, def)
			}
			expect(mockSlotDescriptor.tags).not.toBeUndefined()
			expect(mockSlotDescriptor.tags).toMatchInlineSnapshot(`
			Object {
			  "ignore": Array [
			    Object {
			      "description": true,
			      "title": "ignore",
			    },
			  ],
			}
		`)
			done()
		})
	})

	describe('bindings', () => {
		it('should describe slots bindings in render functions', async done => {
			const src = `
		export default {
		  render(createElement) {
			return createElement('div', [
				/** 
				 * @slot The header 
				 * @binding {object} menuItem the menu item
				 */
				this.$scopedSlots.default({
					menuItem: this.message
				})
			])
		  }
		}
		`
			const def = parse(src)
			if (def) {
				await slotHandler(documentation, def)
			}
			expect(mockSlotDescriptor.bindings).toMatchObject([
				{
					name: 'menuItem',
					description: 'the menu item'
				}
			])
			done()
		})

		it('should describe slots bindings in JSX', async done => {
			const src = `
		export default {
		  render(createElement) {
			return (
			<div> 
			  {/** 
				* @slot The header 
				* @binding {object} item the menu item
				*/}
			  <slot item={menuItem} />
			</div>)
		  }
		}
		`
			const def = parse(src)
			if (def) {
				await slotHandler(documentation, def)
			}
			expect(mockSlotDescriptor.bindings).toMatchObject([
				{
					name: 'item',
					description: 'the menu item'
				}
			])
			done()
		})
	})
})
