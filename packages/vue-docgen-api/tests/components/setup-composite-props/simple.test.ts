import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const example = path.join(__dirname, './example.vue')
let doc: ComponentDoc

describe('composite props with setup syntax', () => {
	beforeAll(async () => {
		doc = await parse(example)
	})

	it('should return an object', () => {
		expect(typeof doc).toBe('object')
	})
})
