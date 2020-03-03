import getTemplateExpressionAST from '../getTemplateExpressionAST'

describe('getTemplateExpressionAST', () => {
	it('should parse expression successfully', () => {
		expect(getTemplateExpressionAST('{[t]:bobo}')).toBeDefined()
	})

	it('should parse multiline successfully', () => {
		expect(getTemplateExpressionAST('click()\nconsole.log()')).toBeDefined()
	})

	it('should parse single line successfully', () => {
		expect(getTemplateExpressionAST('console.log()')).toBeDefined()
	})
})
