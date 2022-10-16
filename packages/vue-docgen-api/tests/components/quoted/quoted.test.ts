import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const exampleQuoted = path.join(__dirname, './example.vue')
let docQuoted: ComponentDoc

describe('test example vuex', () => {
	beforeAll(async () => {
		docQuoted = await parse(exampleQuoted)
	})

	it('should return an object', () => {
		expect(typeof docQuoted).toBe('object')
	})

	it('The component should parse the quotes', () => {
		expect(docQuoted.methods).toMatchInlineSnapshot('undefined')
		expect(docQuoted.props).toMatchInlineSnapshot(`
			[
			  {
			    "defaultValue": {
			      "func": false,
			      "value": "'blue'",
			    },
			    "name": "color",
			    "type": {
			      "name": "string",
			    },
			  },
			  {
			    "name": "anotherProp",
			    "required": true,
			    "type": {
			      "name": "string",
			    },
			  },
			]
		`)
	})
})
