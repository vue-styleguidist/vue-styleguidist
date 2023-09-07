import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const progressPath = path.join(__dirname, './TypeAliasReference.vue')
let doc: ComponentDoc

describe('setup syntactic sugar with type alias reference', () => {
	beforeEach(async () => {
		doc = await parse(progressPath)
	})

	describe('props', () => {
		it('cannot get props if type definition is reference type', () => {
			expect(doc.props).toBeUndefined()
		})
	})
})
