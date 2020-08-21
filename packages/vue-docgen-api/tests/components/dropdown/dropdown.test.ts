import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const button = path.join(__dirname, './dropdown.vue')
let docDropDown: ComponentDoc

describe('tests wrapper with root slot', () => {
	beforeEach(async () => {
		docDropDown = await parse(button)
	})

	it('should return an object', () => {
		expect(typeof docDropDown).toBe('object')
	})

	it('should pick up the component name', () => {
		expect(docDropDown.displayName).toBe('dropdown')
	})

	it('should have tags matching the snapshot', () => {
		expect(docDropDown.tags).toMatchInlineSnapshot(`
		Object {
		  "requires": Array [
		    Object {
		      "description": "./part.vue",
		      "title": "requires",
		    },
		    Object {
		      "description": "./part2.vue",
		      "title": "requires",
		    },
		  ],
		}
	`)
	})
})
