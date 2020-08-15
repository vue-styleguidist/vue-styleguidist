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

describe('render function slotHandler', () => {
	let documentation: Documentation
	let mockSlotDescriptor: SlotDescriptor

	beforeEach(() => {
		mockSlotDescriptor = { name: 'default', description: '' }
		documentation = new Documentation('dummy/path')
		const mockGetSlotDescriptor = documentation.getSlotDescriptor as jest.Mock
		mockGetSlotDescriptor.mockReturnValue(mockSlotDescriptor)
	})

	it('should provide an escape hatch for unexpected slots', async done => {
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
		done()
	})

	it('should allow for multiple slots', async done => {
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
		done()
	})

	it('should use default is no name is provided', async done => {
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
		done()
	})

	it('should describe slot using the description', async done => {
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
		done()
	})

	it('should allow binding description', async done => {
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
		done()
	})
})
