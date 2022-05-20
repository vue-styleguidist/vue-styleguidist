import { getTypeDefinitionFromIdentifier } from './tsUtils'
import buildParser from '../../babel-parser'

describe('getTypeDefinitionFromIdentifier', () => {
	it('resolves an interface in the global scope', () => {
		const parser = buildParser({ plugins: ['typescript'] })
		expect(
			getTypeDefinitionFromIdentifier(
				parser.parse(`
    interface Foo{

    }`),
				'Foo'
			)?.node.loc
		).toBeDefined()
	})
})
