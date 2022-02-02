import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const progressPath = path.join(__dirname, './Progress.vue')
let doc: ComponentDoc

describe('setup syntactic sugar', () => {
	beforeEach(async () => {
		doc = await parse(progressPath)
	})

	describe('props', () => {
		it('should return a doc object containing props', () => {
			expect(doc).toHaveProperty('props')
		})

		it('should find 3 props', () => {
			expect(doc.props).toHaveLength(3)
		})

		it('should match the snapshot', () => {
			expect(doc.props).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "description": "The radius of the circle.",
			    "name": "radius",
			    "required": true,
			    "type": Object {
			      "name": "number",
			    },
			  },
			  Object {
			    "description": "The stroke width of the circle.",
			    "name": "stroke",
			    "required": true,
			    "type": Object {
			      "name": "number",
			    },
			  },
			  Object {
			    "description": "The percentage of the circle that is filled.",
			    "name": "progress",
			    "required": false,
			    "type": Object {
			      "name": "number",
			    },
			  },
			]
		`)
		})
		describe('events', () => {
			it('should return a doc object containing events', () => {
				expect(doc.events).toHaveLength(2)
			})

			it('should match the snapshot', () => {
				expect(doc.events).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "description": "Cancels everything",
			    "name": "cancel",
			    "type": undefined,
			  },
			  Object {
			    "description": "Save the world",
			    "name": "save",
			    "type": Object {
			      "names": Array [
			        "number",
			      ],
			    },
			  },
			]
		`)
			})
		})
	})
})
