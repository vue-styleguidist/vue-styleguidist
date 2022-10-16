import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parseMulti } from '../../../src/main'

const button = path.join(__dirname, './two-class.ts')
let docTest: ComponentDoc[]
describe('tests button', () => {
	beforeAll(async () => {
		docTest = await parseMulti(button)
	})

	it('should contain two components', () => {
		expect(docTest).toHaveLength(2)
	})

	it('should have one prop on the first', () => {
		expect(docTest[0].props).toHaveLength(1)
	})

	it('should have one prop on the second', () => {
		expect(docTest[1].props).toHaveLength(1)
	})
})
