import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const button = path.join(__dirname, './Button.vue')
let docButton: ComponentDoc
describe('tests button', () => {
	beforeAll(async () => {
		docButton = await parse(button)
	})

	it('should match the snapshot', () => {
		expect(docButton).toMatchInlineSnapshot(`
		Object {
		  "description": "Buttons allow users to perform an action or to navigate to another page.
		They have multiple styles for various needs, and are ideal for calling attention
		to where a user needs to do something in order to move forward in a flow.",
		  "displayName": "Button",
		  "events": undefined,
		  "exportName": "default",
		  "methods": undefined,
		  "props": undefined,
		  "slots": Array [
		    Object {
		      "description": "Use this slot default",
		      "name": "default",
		    },
		  ],
		  "tags": Object {
		    "group": Array [
		      Object {
		        "description": "Form Elements",
		        "title": "group",
		      },
		    ],
		  },
		}
	`)
	})
})
