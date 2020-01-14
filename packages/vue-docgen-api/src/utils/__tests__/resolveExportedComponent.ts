import babylon from '../../babel-parser'
import resolveExportedComponent from '../resolveExportedComponent'

describe('resolveExportedComponent', () => {
	it('should return exported components with vuetify format', () => {
		const ast = babylon().parse('export default baseMixins.extend().extend({})')
		expect(resolveExportedComponent(ast).size).toBe(1)
	})
	it('should return an export default', () => {
		const ast = babylon().parse('export default {}')
		expect(resolveExportedComponent(ast).size).toBe(1)
	})

	it('should return an es6 export with its name', () => {
		const ast = babylon().parse('export const test = {}')
		expect(resolveExportedComponent(ast).get('test')).not.toBeUndefined()
	})

	it('should return an es6 export with its name even with 2 statements', () => {
		const ast = babylon().parse(['const testTwoLines = {};', 'export { testTwoLines };'].join('\n'))
		expect(resolveExportedComponent(ast).get('testTwoLines')).not.toBeUndefined()
	})

	it('should return an es5 export', () => {
		const ast = babylon().parse('module.exports = {};')
		expect(resolveExportedComponent(ast).get('default')).not.toBeUndefined()
	})

	it('should accept a conditional es5 export', () => {
		const ast = babylon().parse('if(module !== undefined){ module.exports = {};}')
		expect(resolveExportedComponent(ast).get('default')).not.toBeUndefined()
	})

	it('should return an es5 export direct', () => {
		const ast = babylon().parse('exports = {};')
		expect(resolveExportedComponent(ast).size).toBe(1)
	})

	it('should return an es5 exports.variable', () => {
		const ast = babylon().parse('exports.xxx = {};')
		expect(resolveExportedComponent(ast).get('xxx')).not.toBeUndefined()
	})

	it('should return indirectly exported components', () => {
		const ast = babylon().parse(['const test = {}', 'export default test'].join('\n'))
		expect(resolveExportedComponent(ast).size).toBe(1)
	})

	it('should return indirectly exported class style components', () => {
		const ast = babylon().parse(
			['@Component()', 'class testClass extends Vue{}', 'export default testClass'].join('\n')
		)
		expect(resolveExportedComponent(ast).get('default')).not.toBeUndefined()
	})

	it('should return indirectly exported components es5', () => {
		const ast = babylon().parse(['const test = {}', 'module.exports = test'].join('\n'))
		expect(resolveExportedComponent(ast).size).toBe(1)
	})

	it('should return exported class style components', () => {
		const ast = babylon().parse(
			['@Component()', 'export default class Bart extends testComponent {}'].join('\n')
		)
		expect(resolveExportedComponent(ast).size).toBe(1)
	})

	it('should return exported typescript extend style components', () => {
		const ast = babylon({ plugins: ['typescript'] }).parse(
			['export default Vue.extend({})'].join('\n')
		)
		expect(resolveExportedComponent(ast).size).toBe(1)
	})

	it('should return exported typescript extend custom VueConstructor', () => {
		const ast = babylon({ plugins: ['typescript'] }).parse(
			['export default (Vue as VueConstructor<Vue & SomeInterface>).extend({})'].join('\n')
		)
		expect(resolveExportedComponent(ast).size).toBe(1)
	})
})
