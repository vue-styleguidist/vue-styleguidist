import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const button = path.join(__dirname, './Test.vue')
let docTest: ComponentDoc
describe('tests button', () => {
	beforeAll(async () => {
		docTest = await parse(button)
	})

	it('should match the snapshot', () => {
		expect(docTest).toMatchInlineSnapshot(`
			{
			  "description": "",
			  "displayName": "MyButton",
			  "events": undefined,
			  "exportName": "default",
			  "exposes": undefined,
			  "methods": undefined,
			  "props": [
			    {
			      "defaultValue": {
			        "func": false,
			        "value": "''",
			      },
			      "description": "Some property which should be shown on a doc page",
			      "mixin": {
			        "name": "MyMixin",
			        "path": "../../mixins/ts.ts",
			      },
			      "name": "someProp",
			      "tags": {},
			      "type": {
			        "name": "string",
			      },
			    },
			  ],
			  "slots": undefined,
			  "tags": {},
			}
		`)
	})
})
