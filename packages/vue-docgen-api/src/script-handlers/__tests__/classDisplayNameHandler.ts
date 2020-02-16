import babylon from '../../babel-parser'
import Documentation from '../../Documentation'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import classDisplayNameHandler from '../classDisplayNameHandler'

jest.mock('../../Documentation')

function parse(src: string) {
	const ast = babylon().parse(src)
	return resolveExportedComponent(ast)[0]
}

describe('classDisplayNameHandler', () => {
	let documentation: Documentation

	beforeEach(() => {
		documentation = new Documentation('dummy/path')
	})

	it('should extract the name of the component from the classname', () => {
		const src = `
    @Component
    export default class Decorum extends Vue{
    }
    `
		const def = parse(src).get('default')
		if (def) {
			classDisplayNameHandler(documentation, def)
		}
		expect(documentation.set).toHaveBeenCalledWith('displayName', 'Decorum')
	})

	it('should extract the name of the component from the decorators', () => {
		const src = `
    @Component({name: 'decorum'})
    export default class Test extends Vue{
    }
    `
		const def = parse(src).get('default')
		if (def) {
			classDisplayNameHandler(documentation, def)
		}
		expect(documentation.set).toHaveBeenCalledWith('displayName', 'decorum')
	})
})
