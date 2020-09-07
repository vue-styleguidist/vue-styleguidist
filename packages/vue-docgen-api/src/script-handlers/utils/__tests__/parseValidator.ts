import * as bt from '@babel/types'
import parseValidatorForValues from '../parseValidator'
import buildParser from '../../../babel-parser'

const parser: { parse: (src: string) => bt.File } = buildParser({ plugins: ['jsx'] })

function getValidator(src: string): any {
	const ast = parser.parse(`var a = {${src}}`)
	return (ast.program.body[0] as any).declarations[0].init.properties[0].value
}

describe('parseValidatorForValues', () => {
	it('should allow indexOf > -1', () => {
		const validator = getValidator(`validator: a => ['sm', 'md', 'lg'].indexOf(a) > -1`)
		expect(parseValidatorForValues(validator)).toEqual(['sm', 'md', 'lg'])
	})

	it('should allow -1 < indexOf', () => {
		const validator = getValidator(`validator: a => -1 < ['sm', 'md', 'lg'].indexOf(a)`)
		expect(parseValidatorForValues(validator)).toEqual(['sm', 'md', 'lg'])
	})

	it('should allow indexOf !== -1', () => {
		const validator = getValidator(`validator: a => ['sm', 'md', 'lg'].indexOf(a) !== -1`)
		expect(parseValidatorForValues(validator)).toEqual(['sm', 'md', 'lg'])
	})

	it('should allow -1 !== indexOf', () => {
		const validator = getValidator(`validator: a => -1 !== ['sm', 'md', 'lg'].indexOf(a)`)
		expect(parseValidatorForValues(validator)).toEqual(['sm', 'md', 'lg'])
	})

	it('should allow indexOf != -1', () => {
		const validator = getValidator(`validator: a => ['sm', 'md', 'lg'].indexOf(a) != -1`)
		expect(parseValidatorForValues(validator)).toEqual(['sm', 'md', 'lg'])
	})

	it('should allow -1 != indexOf', () => {
		const validator = getValidator(`validator: a => -1 != ['sm', 'md', 'lg'].indexOf(a)`)
		expect(parseValidatorForValues(validator)).toEqual(['sm', 'md', 'lg'])
	})

	it('should allow use of includes', () => {
		const validator = getValidator(`validator: a => ['sm', 'md', 'lg'].includes(a)`)
		expect(parseValidatorForValues(validator)).toEqual(['sm', 'md', 'lg'])
	})

	it('should not fail if a member of the array is an object', () => {
		const validator = getValidator(`validator: a => ['sm', {foo:'bar'}, 'lg'].includes(a)`)
		expect(parseValidatorForValues(validator)).toEqual(['sm', 'lg'])
	})

	it('should simply ignore references to functions', () => {
		const validator = getValidator(`validator: isItAnEvenNumber`)
		expect(parseValidatorForValues(validator)).toBeUndefined()
	})
})
