import babylon from '../../babel-parser'
import resolveRequired from '../resolveRequired'

describe('resolveRequired', () => {
	it('should resolve imported variables', () => {
		const ast = babylon().parse('import {test, bonjour} from "test/path";')
		const varNames = resolveRequired(ast)
		expect(varNames).toMatchObject({
			test: { filePath: ['test/path'], exportName: 'test' },
			bonjour: { filePath: ['test/path'], exportName: 'bonjour' }
		})
	})

	it('should resolve imported default', () => {
		const ast = babylon().parse('import bonjour from "test/path";')
		const varNames = resolveRequired(ast)
		expect(varNames).toMatchObject({
			bonjour: { filePath: ['test/path'], exportName: 'default' }
		})
	})

	it('should resolve imported variable as another name', () => {
		const ast = babylon().parse('import {bonjour as hello} from "test/path";')
		const varNames = resolveRequired(ast)
		expect(varNames).toMatchObject({
			hello: { filePath: ['test/path'], exportName: 'bonjour' }
		})
	})

	it('should resolve required variables', () => {
		const ast = babylon().parse(
			[
				'const hello = require("test/pathEN");',
				'const { bonjour } = require("test/pathFR");',
				''
			].join('\n')
		)
		expect(resolveRequired(ast)).toMatchObject({
			hello: { filePath: ['test/pathEN'], exportName: 'default' },
			bonjour: { filePath: ['test/pathFR'], exportName: 'default' }
		})
	})

	it('should require even default', () => {
		const ast = babylon().parse(
			[
				'const { ciao, astaruego } = require("test/pathOther");',
				'const sayonara = require("test/pathJP").default;',
				''
			].join('\n')
		)
		expect(resolveRequired(ast)).toMatchObject({
			ciao: { filePath: ['test/pathOther'], exportName: 'default' },
			astaruego: { filePath: ['test/pathOther'], exportName: 'default' },
			sayonara: { filePath: ['test/pathJP'], exportName: 'default' }
		})
	})

	it('should not return non required variables', () => {
		const ast = babylon().parse('const sayonara = "Japanese Hello";')
		expect(resolveRequired(ast).sayonara).toBeUndefined()
	})
})
