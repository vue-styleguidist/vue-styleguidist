import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const exampleQuoted = path.join(__dirname, './named.tsx')
let docNamed: ComponentDoc

describe('test example vuex', () => {
	beforeAll(async () => {
		docNamed = await parse(exampleQuoted)
	})

	it('should return an object', () => {
		expect(typeof docNamed).toBe('object')
	})

	it('The component should parse the quotes', () => {
		expect(docNamed.props?.length).toBe(1)
	})
})
