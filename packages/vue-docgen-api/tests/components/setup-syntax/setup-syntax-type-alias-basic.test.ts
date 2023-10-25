import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const progressPath = path.join(__dirname, './TypeAliasBasic.vue')
let doc: ComponentDoc

describe('setup syntactic sugar with type alias basic', () => {
	beforeEach(async () => {
		doc = await parse(progressPath)
	})

	describe('props', () => {
		it('should return a doc object containing props', () => {
			expect(doc).toHaveProperty('props')
		})

		it('should find 2 props', () => {
			expect(doc.props).toHaveLength(2)
		})

		it('should match the snapshot', () => {
			expect(doc.props).toMatchInlineSnapshot(`
				[
				  {
				    "description": "This is name",
				    "name": "name",
				    "required": true,
				    "type": {
				      "name": "string",
				    },
				  },
				  {
				    "description": "This is age",
				    "name": "age",
				    "required": true,
				    "type": {
				      "name": "number",
				    },
				  },
				]
			`)
		})
	})
})
