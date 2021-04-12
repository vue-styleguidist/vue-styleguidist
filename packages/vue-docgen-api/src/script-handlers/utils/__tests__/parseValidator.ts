import * as bt from '@babel/types'
import { parse } from 'recast'
import parseValidatorForValues from '../parseValidator'
import buildParser from '../../../babel-parser'

const parser: { parse: (src: string) => bt.File } = buildParser({ plugins: ['jsx'] })

function getValidator(src: string): any {
	const ast = parser.parse(`var a = {${src}}`)
	return (ast.program.body[0] as any).declarations[0].init.properties[0].value
}

describe('parseValidatorForValues', () => {
	let ast: bt.File
	beforeAll(() => {
		ast = parse('const a  = 1')
	})
	it('should allow indexOf > -1', async () => {
		const validator = getValidator(`validator: a => ['sm', 'md', 'lg'].indexOf(a) > -1`)
		expect(
			await parseValidatorForValues(validator, ast, { filePath: '', validExtends: () => true })
		).toEqual(['sm', 'md', 'lg'])
	})

	it('should allow -1 < indexOf', async () => {
		const validator = getValidator(`validator: a => -1 < ['sm', 'md', 'lg'].indexOf(a)`)
		expect(
			await parseValidatorForValues(validator, ast, { filePath: '', validExtends: () => true })
		).toEqual(['sm', 'md', 'lg'])
	})

	it('should allow indexOf !== -1', async () => {
		const validator = getValidator(`validator: a => ['sm', 'md', 'lg'].indexOf(a) !== -1`)
		expect(
			await parseValidatorForValues(validator, ast, { filePath: '', validExtends: () => true })
		).toEqual(['sm', 'md', 'lg'])
	})

	it('should allow -1 !== indexOf', async () => {
		const validator = getValidator(`validator: a => -1 !== ['sm', 'md', 'lg'].indexOf(a)`)
		expect(
			await parseValidatorForValues(validator, ast, { filePath: '', validExtends: () => true })
		).toEqual(['sm', 'md', 'lg'])
	})

	it('should allow indexOf != -1', async () => {
		const validator = getValidator(`validator: a => ['sm', 'md', 'lg'].indexOf(a) != -1`)
		expect(
			await parseValidatorForValues(validator, ast, { filePath: '', validExtends: () => true })
		).toEqual(['sm', 'md', 'lg'])
	})

	it('should allow -1 != indexOf', async () => {
		const validator = getValidator(`validator: a => -1 != ['sm', 'md', 'lg'].indexOf(a)`)
		expect(
			await parseValidatorForValues(validator, ast, { filePath: '', validExtends: () => true })
		).toEqual(['sm', 'md', 'lg'])
	})

	it('should allow use of includes', async () => {
		const validator = getValidator(`validator: a => ['sm', 'md', 'lg'].includes(a)`)
		expect(
			await parseValidatorForValues(validator, ast, { filePath: '', validExtends: () => true })
		).toEqual(['sm', 'md', 'lg'])
	})

	it('should not fail if a member of the array is an object', async () => {
		const validator = getValidator(`validator: a => ['sm', {foo:'bar'}, 'lg'].includes(a)`)
		expect(
			await parseValidatorForValues(validator, ast, { filePath: '', validExtends: () => true })
		).toEqual(['sm', 'lg'])
	})

	it('should simply ignore references to functions', async () => {
		const validator = getValidator(`validator: isItAnEvenNumber`)
		expect(
			await parseValidatorForValues(validator, ast, { filePath: '', validExtends: () => true })
		).toBeUndefined()
	})
})
