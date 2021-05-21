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
		expect(docTest.length).toBe(2)
	})
})
