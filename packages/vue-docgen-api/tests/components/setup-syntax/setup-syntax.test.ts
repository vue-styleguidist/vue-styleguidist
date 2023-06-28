import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const progressPath = path.join(__dirname, './Progress.vue')
let doc: ComponentDoc

describe('setup syntactic sugar', () => {
	beforeEach(async () => {
		doc = await parse(progressPath)
	})

	describe('options', () => {
		it('should return a doc object containing name', () => {
			expect(doc).toHaveProperty('name')
		})

		it('should have name ProgressBlobInVue', () => {
			expect(doc.name).toEqual('ProgressBlobInVue')
		})

		it('should return a doc object containing displayName', () => {
			expect(doc.displayName).toEqual('Name set in JSDoc')
		})
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
				[
				  {
				    "description": "The radius of the circle.",
				    "name": "radius",
				    "required": true,
				    "type": {
				      "name": "number",
				    },
				  },
				  {
				    "description": "The stroke width of the circle.",
				    "name": "stroke",
				    "required": true,
				    "type": {
				      "name": "number",
				    },
				  },
				  {
				    "defaultValue": {
				      "func": false,
				      "value": "0",
				    },
				    "description": "The percentage of the circle that is filled.",
				    "name": "progress",
				    "required": false,
				    "type": {
				      "name": "number",
				    },
				  },
				]
			`)
		})
	})

	describe('events', () => {
		it('should return a doc object containing events', () => {
			expect(doc.events).toHaveLength(2)
		})

		it('should match the snapshot', () => {
			expect(doc.events).toMatchInlineSnapshot(`
					[
					  {
					    "description": "Cancels everything",
					    "name": "cancel",
					    "type": undefined,
					  },
					  {
					    "description": "Save the world",
					    "name": "save",
					    "type": {
					      "names": [
					        "number",
					      ],
					    },
					  },
					]
				`)
		})
	})

	describe('expose', () => {
		it('should return a doc object containing expose', () => {
			expect(doc.expose).toHaveLength(1)
		})

		it('should match the snapshot', () => {
			expect(doc.expose).toMatchInlineSnapshot(`
          [
            {
              "description": "position of the dash offset",
              "name": "strokeDashoffset",
            },
          ]
        `)
		})
	})
})
