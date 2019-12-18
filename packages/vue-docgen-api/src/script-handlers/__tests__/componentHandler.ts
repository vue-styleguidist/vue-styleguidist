import { ParserPlugin } from '@babel/parser'
import { NodePath } from 'ast-types'
import Map from 'ts-map'
import babylon from '../../babel-parser'
import Documentation from '../../Documentation'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import componentHandler from '../componentHandler'

jest.mock('../../Documentation')

function parse(src: string, plugins: ParserPlugin[] = []): Map<string, NodePath> {
	const ast = babylon({ plugins }).parse(src)
	return resolveExportedComponent(ast)
}

describe('componentHandler', () => {
	let documentation: Documentation

	beforeEach(() => {
		documentation = new Documentation()
	})

	it('should return the right component name', () => {
		const src = `
    /**
     * An empty component #1
     */
    export default {
      name: 'name-123',
    }
    `
		const def = parse(src).get('default')
		if (def) {
			componentHandler(documentation, def)
		}
		expect(documentation.set).toHaveBeenCalledWith('description', 'An empty component #1')
	})

	it('should return the right component description with import', () => {
		const src = `
	import { test } from 'vue-test'
		
    /**
     * An empty component #1.1
     */
    export default {
      name: 'name-123',
    }
    `
		const def = parse(src).get('default')
		if (def) {
			componentHandler(documentation, def)
		}
		expect(documentation.set).toHaveBeenCalledWith('description', 'An empty component #1.1')
	})

	it('should return tags for normal components', () => {
		const src = `
    /**
     * An empty component #2
     * @version 12.5.7
     * @author [Rafael]
     */
    export default {
      name: 'name-123',
    }
    `
		const def = parse(src).get('default')
		if (def) {
			componentHandler(documentation, def)
		}
		expect(documentation.set).toHaveBeenCalledWith('tags', {
			author: [{ description: '[Rafael]', title: 'author' }],
			version: [{ description: '12.5.7', title: 'version' }]
		})
	})

	it('should return tags for class style components', () => {
		const src = `
    /**
     * An empty component #3
     * @version 12.5.7
     */
    @Component
    export default class myComp {

    }
    `
		const def = parse(src, ['typescript']).get('default')
		if (def) {
			componentHandler(documentation, def)
		}
		expect(documentation.set).toHaveBeenCalledWith('tags', {
			version: [{ description: '12.5.7', title: 'version' }]
		})
	})

	it('should detect functional flags', () => {
		const src = `
    export default {
      functional:true
    }
    `
		const def = parse(src).get('default')
		if (def) {
			componentHandler(documentation, def)
		}
		expect(documentation.set).toHaveBeenCalledWith('functional', true)
	})

	it('should compile @example tags into one examples', () => {
		const src = `
		/**
		 * @example path/to/example.md
		 * @example path/to/otherexample.md
		 */
    export default {
    }
    `
		const def = parse(src).get('default')
		if (def) {
			componentHandler(documentation, def)
		}
		expect(documentation.set).toHaveBeenCalledWith('tags', {
			examples: [
				{
					content: 'path/to/example.md',
					title: 'example'
				},
				{
					content: 'path/to/otherexample.md',
					title: 'example'
				}
			]
		})
	})

	it('should extract the @displayName tag seperately', () => {
		const src = `
		/**
		 * @displayName Best Button Ever
		 */
    export default {
    }
    `
		const def = parse(src).get('default')
		if (def) {
			componentHandler(documentation, def)
		}
		expect(documentation.set).toHaveBeenCalledWith('displayName', 'Best Button Ever')
	})
})
