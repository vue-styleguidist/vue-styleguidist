import * as path from 'path'

import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const docs = path.join(__dirname, './docs.vue')
let onlyDocs: ComponentDoc

describe('docs only vue file', () => {
	beforeAll(async () => {
		onlyDocs = await parse(docs)
	})

	it('should return an object', () => {
		expect(onlyDocs.docsBlocks).not.toBeUndefined()
	})
})
