import transformOneImport from '../transformOneImport'

describe('transformOneImport', () => {
	const test = 0
	it('should convert default imports', () => {
		const requiredImport = transformOneImport(
			{ start: 0, end: 100 },
			'import bar from "./foo"',
			test
		)
		expect(requiredImport.code).toBe(
			["const foo$0 = require('./foo');", 'const bar = foo$0.default || foo$0;'].join('\n')
		)
	})

	it('should convert named imports', () => {
		const requiredImport = transformOneImport(
			{ start: 0, end: 100 },
			'import { bar } from "./foo"',
			test
		)
		expect(requiredImport.code).toBe(
			["const foo$0 = require('./foo');", 'const bar = foo$0.bar;'].join('\n')
		)
	})

	it('should convert re-named imports', () => {
		const requiredImport = transformOneImport(
			{ start: 0, end: 100 },
			'import { foo as bar } from "./foo"',
			test
		)
		expect(requiredImport.code).toBe(
			["const foo$0 = require('./foo');", 'const bar = foo$0.foo;'].join('\n')
		)
	})

	it('should convert mixed imports', () => {
		const requiredImport = transformOneImport(
			{ start: 0, end: 100 },
			'import baz, { foo as bar } from "./bar"',
			test
		)
		expect(requiredImport.code).toBe(
			[
				"const bar$0 = require('./bar');",
				'const baz = bar$0.default || bar$0;',
				'const bar = bar$0.foo;'
			].join('\n')
		)
	})

	it('should convert * as imports', () => {
		const requiredImport = transformOneImport(
			{ start: 0, end: 100 },
			'import * as bar from "./foo"',
			test
		)
		expect(requiredImport.code).toBe(
			["const foo$0 = require('./foo');", 'const bar = foo$0.default || foo$0;'].join('\n')
		)
	})
})
