import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const progressPath = path.join(__dirname, './TypeAliasImport.vue')
let doc: ComponentDoc

describe('setup syntactic sugar with type alias import', () => {
	beforeEach(async () => {
		doc = await parse(progressPath)
	})

	describe('props', () => {
		it('should return a doc object containing props', () => {
			expect(doc).toHaveProperty('props')
		})

		it('should find 1 props', () => {
			expect(doc.props).toHaveLength(1)
		})

		it('should match the snapshot', () => {
			expect(doc.props).toMatchInlineSnapshot(`
				[
				  {
				    "description": "This is externalProps1",
				    "name": "externalProps1",
				    "required": false,
				    "type": {
				      "name": "string",
				    },
				  },
				]
			`)
		})
	})
})
