import getAst from '../getAst'

test('jsx parsing', () => {
	expect(() => getAst("my(<jsx/>, 'code');")).not.toThrow()
})
