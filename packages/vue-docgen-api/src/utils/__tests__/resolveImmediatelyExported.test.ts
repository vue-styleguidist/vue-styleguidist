import babylon from '../../babel-parser'
import resolveImmediatelyExported from '../resolveImmediatelyExported'

describe('resolveImmediatelyExported', () => {
	it('should immediately exported varibles', () => {
		const ast = babylon().parse('export { test } from "test/path";')
		const varNames = resolveImmediatelyExported(ast, ['test'])
		expect(varNames).toMatchObject({
			test: { filePath: ['test/path'], exportName: 'test' }
		})
	})

	it('should immediately exported varibles with aliases', () => {
		const ast = babylon().parse('export { test as changedName } from "test/path";')
		const varNames = resolveImmediatelyExported(ast, ['changedName'])
		expect(varNames).toMatchObject({
			changedName: { filePath: ['test/path'], exportName: 'test' }
		})
	})

	it('should resolve immediately exported varibles in two steps', () => {
		const ast = babylon().parse(
			[
				'import { test as middleName } from "test/path";',
				'export { middleName as changedName };'
			].join('\n')
		)
		const varNames = resolveImmediatelyExported(ast, ['changedName'])
		expect(varNames).toMatchObject({
			changedName: { filePath: ['test/path'], exportName: 'test' }
		})
	})

	it('should return immediately exported varibles in two steps with default import', () => {
		const ast = babylon().parse(
			['import test from "test/path";', 'export { test as changedName };'].join('\n')
		)
		const varNames = resolveImmediatelyExported(ast, ['changedName'])
		expect(varNames).toMatchObject({
			changedName: { filePath: ['test/path'], exportName: 'default' }
		})
	})

	it('should return immediately exported varibles in two steps with default export', () => {
		const ast = babylon().parse(
			['import { test } from "test/path";', 'export default test;'].join('\n')
		)
		const varNames = resolveImmediatelyExported(ast, ['default'])
		expect(varNames).toMatchObject({
			default: { filePath: ['test/path'], exportName: 'test' }
		})
	})

	it('should resolve export all as all remaining variables', () => {
		const ast = babylon().parse(
			[
				'export foo from "file/path"', // export this one to ignore
				'export * from "test/path";'
			].join('\n')
		)
		const varNames = resolveImmediatelyExported(ast, ['foo', 'baz'])
		expect(varNames).toMatchObject({
			foo: { filePath: ['file/path'], exportName: 'foo' },
			baz: { filePath: ['test/path'], exportName: 'baz' }
		})
	})
})
