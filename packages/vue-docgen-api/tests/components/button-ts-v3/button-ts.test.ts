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
			{
			  "description": "Buttons allow users to perform an action or to navigate to another page.
			They have multiple styles for various needs, and are ideal for calling attention
			to where a user needs to do something in order to move forward in a flow.",
			  "displayName": "Button",
			  "events": undefined,
			  "exportName": "default",
			  "expose": undefined,
			  "methods": undefined,
			  "name": "DsButton",
			  "props": undefined,
			  "slots": [
			    {
			      "description": "Use this slot default",
			      "name": "default",
			    },
			  ],
			  "sourceFiles": [
			    /packages/vue-docgen-api/tests/components/button-ts-v3/Button.vue,
			  ],
			  "tags": {
			    "group": [
			      {
			        "description": "Form Elements",
			        "title": "group",
			      },
			    ],
			  },
			}
		`)
	})
})
