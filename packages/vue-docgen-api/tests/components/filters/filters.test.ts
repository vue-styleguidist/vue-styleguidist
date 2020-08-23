import * as path from 'path'

import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const docs = path.join(__dirname, './Index.vue')
let filterDocs: ComponentDoc

describe('docs only vue file', () => {
	beforeAll(async () => {
		filterDocs = await parse(docs)
	})

	it('should return an object', () => {
		expect(filterDocs.slots).not.toBeUndefined()
	})

	it('should parse the @displayName', () => {
		expect(filterDocs.displayName).toBe('NotFilters')
	})
})
