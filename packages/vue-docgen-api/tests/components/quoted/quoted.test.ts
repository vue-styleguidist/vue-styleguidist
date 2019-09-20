import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const exampleQuoted = path.join(__dirname, './example.vue')
let docQuoted: ComponentDoc

describe('test example vuex', () => {
	beforeAll(done => {
		docQuoted = parse(exampleQuoted)
		done()
	})

	it('should return an object', () => {
		expect(typeof docQuoted).toBe('object')
	})

	it('The component should parse the quotes', () => {
		expect(docQuoted.methods).toMatchInlineSnapshot(`
				Array [
				  Object {
				    "description": "Sets the order",
				    "modifiers": Array [],
				    "name": "onSubmit",
				    "params": Array [
				      Object {
				        "description": "Key to order",
				        "name": "key",
				        "title": "param",
				        "type": Object {
				          "name": "string",
				        },
				      },
				    ],
				    "returns": Object {
				      "description": "Test",
				      "title": "returns",
				      "type": Object {
				        "name": "string",
				      },
				    },
				    "tags": Object {
				      "access": Array [
				        Object {
				          "description": "public",
				          "title": "access",
				        },
				      ],
				      "params": Array [
				        Object {
				          "description": "Key to order",
				          "name": "key",
				          "title": "param",
				          "type": Object {
				            "name": "string",
				          },
				        },
				      ],
				      "returns": Array [
				        Object {
				          "description": "Test",
				          "title": "returns",
				          "type": Object {
				            "name": "string",
				          },
				        },
				      ],
				      "since": Array [
				        Object {
				          "description": "Version 1.0.1",
				          "title": "since",
				        },
				      ],
				      "version": Array [
				        Object {
				          "description": "1.0.5",
				          "title": "version",
				        },
				      ],
				    },
				  },
				]
		`)
		expect(docQuoted.props).toMatchInlineSnapshot(`
		Object {
		  "anotherProp": Object {
		    "description": "",
		    "name": "anotherProp",
		    "required": true,
		    "tags": Object {},
		    "type": Object {
		      "name": "string",
		    },
		  },
		  "color": Object {
		    "defaultValue": Object {
		      "func": false,
		      "value": "'blue'",
		    },
		    "description": "",
		    "name": "color",
		    "required": "",
		    "tags": Object {},
		    "type": Object {
		      "name": "string",
		    },
		  },
		}
	`)
	})
})
