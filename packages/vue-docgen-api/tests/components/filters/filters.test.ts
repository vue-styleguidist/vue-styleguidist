import * as path from 'path'

import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const docs = path.join(__dirname, './Filters.vue')
let filterDocs: ComponentDoc

describe('docs only vue file', () => {
	beforeAll(async done => {
		filterDocs = await parse(docs)
		done()
	})

	it('should return an object', () => {
		expect(filterDocs.slots).not.toBeUndefined()
	})
})
