import { NodePath } from 'ast-types/lib/node-path'
import buildParser from '../../babel-parser'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import slotHandlerLitteral from '../slotHandlerLitteral'
import Documentation, { SlotDescriptor } from '../../Documentation'

jest.mock('../../Documentation')

function parse(src: string): NodePath | undefined {
	const ast = buildParser({ plugins: ['jsx'] }).parse(src)
	return resolveExportedComponent(ast)[0].get('default')
}

describe('render and setup function slotHandler', () => {
	let documentation: Documentation
	let mockSlotDescriptor: SlotDescriptor

	beforeEach(() => {
		mockSlotDescriptor = { name: 'default', description: '' }
		documentation = new Documentation('dummy/path')
		const mockGetSlotDescriptor = documentation.getSlotDescriptor as jest.Mock
		mockGetSlotDescriptor.mockReturnValue(mockSlotDescriptor)
	})

	describe('render functions', () => {
		it('should provide an escape hatch for unexpected slots', async () => {
			const src = `
export default {
  /**
   * @slot icon
   */
  render() {
	  // anything in here I don't care
  }
}
`
			const def = parse(src)
			if (def) {
				await slotHandlerLitteral(documentation, def)
			}
			expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('icon')
		})

		it('should allow for multiple slots', async () => {
			const src = `
export default {
  /**
   * @slot one
   */
  /**
   * @slot two
   */
  render: function () {
	  // anything in here I don't care
  }
}
`
			const def = parse(src)
			if (def) {
				await slotHandlerLitteral(documentation, def)
			}
			expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('one')
			expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('two')
		})

		it('should use default is no name is provided', async () => {
			const src = `
export default {
  /**
   * @slot
   */
  render: function () {
	  // anything in here I don't care
  }
}
`
			const def = parse(src)
			if (def) {
				await slotHandlerLitteral(documentation, def)
			}
			expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('default')
		})

		it('should describe slot using the description', async () => {
			const src = `
export default {
  /**
   * @slot
   * describe the default slot
   */
  render: function () {
	  // anything in here I don't care
  }
}
`
			const def = parse(src)
			if (def) {
				await slotHandlerLitteral(documentation, def)
			}
			expect(mockSlotDescriptor.description).toBe('describe the default slot')
		})

		it('should allow binding description', async () => {
			const src = `
export default {
  /**
   * @slot
   * @binding {number} index the index in the list
   * @binding {string} content text of the item
   */
  render: function () {
	  // anything in here I don't care
  }
}
`
			const def = parse(src)
			if (def) {
				await slotHandlerLitteral(documentation, def)
			}
			expect(mockSlotDescriptor.bindings).toMatchObject([{ name: 'index' }, { name: 'content' }])
		})
	})

	describe('setup functions', () => {
		it('should provide an escape hatch for unexpected slots', async () => {
			const src = `
export default {
  /**
   * @slot icon
   */
  setup() {
	  // anything in here I don't care
  }
}
`
			const def = parse(src)
			if (def) {
				await slotHandlerLitteral(documentation, def)
			}
			expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('icon')
		})

		it('should allow for multiple slots', async () => {
			const src = `
export default {
  /**
   * @slot one
   */
  /**
   * @slot two
   */
  setup: function () {
	  // anything in here I don't care
  }
}
`
			const def = parse(src)
			if (def) {
				await slotHandlerLitteral(documentation, def)
			}
			expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('one')
			expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('two')
		})

		it('should use default is no name is provided', async () => {
			const src = `
export default {
  /**
   * @slot
   */
  setup: function () {
	  // anything in here I don't care
  }
}
`
			const def = parse(src)
			if (def) {
				await slotHandlerLitteral(documentation, def)
			}
			expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('default')
		})

		it('should describe slot using the description', async () => {
			const src = `
export default {
  /**
   * @slot
   * describe the default slot
   */
  setup: function () {
	  // anything in here I don't care
  }
}
`
			const def = parse(src)
			if (def) {
				await slotHandlerLitteral(documentation, def)
			}
			expect(mockSlotDescriptor.description).toBe('describe the default slot')
		})

		it('should allow binding description', async () => {
			const src = `
export default {
  /**
   * @slot
   * @binding {number} index the index in the list
   * @binding {string} content text of the item
   */
  setup: function () {
	  // anything in here I don't care
  }
}
`
			const def = parse(src)
			if (def) {
				await slotHandlerLitteral(documentation, def)
			}
			expect(mockSlotDescriptor.bindings).toMatchObject([{ name: 'index' }, { name: 'content' }])
		})
	})
})


