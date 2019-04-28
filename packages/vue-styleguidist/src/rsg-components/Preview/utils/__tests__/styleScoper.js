import { scoper } from '../styleScoper'

describe('styleScoper', () => {
	it('should scope css selectors', () => {
		const scopedCSS = scoper(`.bonjour{color:blue;}`, '[test]')
		expect(scopedCSS).toBe('.bonjour[test] {color:blue;}')
	})

	it('should scope css pseudo selectors', () => {
		const scopedCSS = scoper(`.bonjour:before{color:blue;}`, '[test]')
		expect(scopedCSS).toBe('.bonjour[test]:before {color:blue;}')
	})

	it('should scope multiple css selectors', () => {
		const scopedCSS = scoper(`.bonjour, .hello{color:blue;}`, '[test]')
		expect(scopedCSS).toBe('.bonjour[test] ,.hello[test] {color:blue;}')
	})

	it('should scope multiple chained css selectors', () => {
		const scopedCSS = scoper(`.bonjour .hello{color:blue;}`, '[test]')
		expect(scopedCSS).toBe('.bonjour[test] .hello[test] {color:blue;}')
	})
})
