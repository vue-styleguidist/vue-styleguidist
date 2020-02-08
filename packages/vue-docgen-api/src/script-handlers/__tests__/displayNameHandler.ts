import { NodePath } from 'ast-types'
import babylon from '../../babel-parser'
import Documentation from '../../Documentation'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import displayNameHandler from '../displayNameHandler'

jest.mock('../../Documentation')

function parse(src: string): NodePath | undefined {
	const ast = babylon().parse(src)
	return resolveExportedComponent(ast)[0].get('default')
}

describe('displayNameHandler', () => {
	let documentation: Documentation

	beforeEach(() => {
		documentation = new Documentation('dummy/path')
	})

	it('should return the right component name', () => {
		const src = `
    export default {
      name: 'name-123',
      components: {
        testComp: {}
      }
    }
    `
		const def = parse(src)
		if (def) {
			displayNameHandler(documentation, def)
		}
		expect(documentation.set).toHaveBeenCalledWith('displayName', 'name-123')
	})

	it('should return the right component name as a constant', () => {
		const src = `
    const NAME = 'name-123';
    export default {
      name: NAME,
      components: {
        testComp: {}
      }
    }
    `
		const def = parse(src)
		if (def) {
			displayNameHandler(documentation, def)
		}
		expect(documentation.set).toHaveBeenCalledWith('displayName', 'name-123')
	})
})
