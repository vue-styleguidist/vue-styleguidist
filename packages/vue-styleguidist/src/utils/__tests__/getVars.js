import getVars from '../getVars'

describe('getVars', () => {
	it('should detect const', () => {
		const sut = getVars('const param = "Foo";')
		expect(sut).toContain('param')
	})

	it('should detect function', () => {
		const sut = getVars('function test(){return param;}')
		expect(sut).toContain('test')
	})

	it('should detect var', () => {
		const sut = getVars('var param, make, it, rain;')
		expect(sut).toContain('param')
		expect(sut).toContain('rain')
	})
})
