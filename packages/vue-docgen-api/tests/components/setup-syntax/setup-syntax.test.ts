import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const progressPath = path.join(__dirname, './Progress.vue')
let doc: ComponentDoc

describe('setup syntactic sugar', () => {
	beforeEach(async () => {
		doc = await parse(progressPath)
	})

	it('should return a doc object containing props', () => {
		expect(doc).toHaveProperty('props')
	})
})
