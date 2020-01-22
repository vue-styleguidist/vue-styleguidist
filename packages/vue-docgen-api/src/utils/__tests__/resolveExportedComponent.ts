import babylon from '../../babel-parser'
import resolveExportedComponent from '../resolveExportedComponent'

describe('resolveExportedComponent', () => {
	describe('JavaScript', () => {
		it('should return exported components with vuetify format', () => {
			const ast = babylon().parse('export default baseMixins.extend().extend({})')
			const [components] = resolveExportedComponent(ast)
			expect(components.size).toBe(1)
		})
		it('should return an export default', () => {
			const ast = babylon().parse('export default {}')
			const [components] = resolveExportedComponent(ast)
			expect(components.size).toBe(1)
		})

		it('should return an es6 export with its name', () => {
			const ast = babylon().parse('export const test = {}')
			const [components] = resolveExportedComponent(ast)
			expect(components.get('test')).not.toBeUndefined()
		})

		it('should return an es6 export with its name even with 2 statements', () => {
			const ast = babylon().parse(
				[
					'const testTwoLines = {};', //
					'export { testTwoLines };'
				].join('\n')
			)
			const [components] = resolveExportedComponent(ast)
			expect(components.get('testTwoLines')).not.toBeUndefined()
		})

		it('should return an es5 export', () => {
			const ast = babylon().parse('module.exports = {};')
			const [components] = resolveExportedComponent(ast)
			expect(components.get('default')).not.toBeUndefined()
		})

		it('should accept a conditional es5 export', () => {
			const ast = babylon().parse('if(module !== undefined){ module.exports = {};}')
			const [components] = resolveExportedComponent(ast)
			expect(components.get('default')).not.toBeUndefined()
		})

		it('should return an es5 export direct', () => {
			const ast = babylon().parse('exports = {};')
			const [components] = resolveExportedComponent(ast)
			expect(components.size).toBe(1)
		})

		it('should return an es5 exports.variable', () => {
			const ast = babylon().parse('exports.xxx = {};')
			const [components] = resolveExportedComponent(ast)
			expect(components.get('xxx')).not.toBeUndefined()
		})

		it('should return indirectly exported components', () => {
			const ast = babylon().parse(
				[
					'const test = {}', //
					'export default test'
				].join('\n')
			)
			const [components] = resolveExportedComponent(ast)
			expect(components.size).toBe(1)
		})

		it('should return indirectly exported class style components', () => {
			const ast = babylon().parse(
				[
					'@Component()', //
					'class testClass extends Vue{}',
					'export default testClass'
				].join('\n')
			)
			const [components] = resolveExportedComponent(ast)
			expect(components.get('default')).not.toBeUndefined()
		})

		it('should return indirectly exported components es5', () => {
			const ast = babylon().parse(
				[
					'const test = {}', //
					'module.exports = test'
				].join('\n')
			)
			const [components] = resolveExportedComponent(ast)
			expect(components.size).toBe(1)
		})

		it('should only export components', () => {
			const ast = babylon().parse(
				[
					'export const otherItem = {}', //
					'export const myEnum = {foo: 1, baz: 2}',
					'export default {}'
				].join('\n')
			)
			const [components] = resolveExportedComponent(ast)
			expect(components.size).toBe(2)
		})

		it('should return exported class style components', () => {
			const ast = babylon().parse(
				[
					'@Component()', //
					'export default class Bart extends testComponent {}'
				].join('\n')
			)
			const [components] = resolveExportedComponent(ast)
			expect(components.size).toBe(1)
		})
	})

	describe('TypeScript', () => {
		it('should return exported typescript extend style components', () => {
			const ast = babylon({ plugins: ['typescript'] }).parse(
				['export default Vue.extend({})'].join('\n')
			)
			const [components] = resolveExportedComponent(ast)
			expect(components.size).toBe(1)
		})

		it('should return exported typescript extend custom VueConstructor', () => {
			const ast = babylon({ plugins: ['typescript'] }).parse(
				['export default (Vue as VueConstructor<Vue & SomeInterface>).extend({})'].join('\n')
			)
			const [components] = resolveExportedComponent(ast)
			expect(components.size).toBe(1)
		})

		it('should extract IEV aliased and return them', () => {
			const ast = babylon({ plugins: ['typescript'] }).parse(
				[
					'import { baz as foo } from "file/path"', //
					'export default foo'
				].join('\n')
			)
			const [comps, iev] = resolveExportedComponent(ast)
			expect(iev).toMatchInlineSnapshot(`
			Object {
			  "foo": Object {
			    "exportName": "baz",
			    "filePath": Array [
			      "file/path",
			    ],
			  },
			}
		`)
			expect(comps.size).toBe(0)
		})

		it('should extract IEV and return them', () => {
			const ast = babylon({ plugins: ['typescript'] }).parse(
				[
					'import foo from "file/path/foo"', //
					'export default foo'
				].join('\n')
			)
			const [comps, iev] = resolveExportedComponent(ast)
			expect(iev).toMatchInlineSnapshot(`
			Object {
			  "foo": Object {
			    "exportName": "default",
			    "filePath": Array [
			      "file/path/foo",
			    ],
			  },
			}
		`)
			expect(comps.size).toBe(0)
		})

		it('should extract IEV and return them when compbined with normal comps', () => {
			const ast = babylon({ plugins: ['typescript'] }).parse(
				[
					'import foo from "file/path/blah"', //
					'export const blah = {}',
					'export default foo'
				].join('\n')
			)
			const [comps, iev] = resolveExportedComponent(ast)
			expect(iev).toMatchInlineSnapshot(`
			Object {
			  "foo": Object {
			    "exportName": "default",
			    "filePath": Array [
			      "file/path/blah",
			    ],
			  },
			}
		`)
			expect(comps.size).toBe(1)
		})
	})
})
