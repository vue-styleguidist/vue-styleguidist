import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const button = path.join(__dirname, './index.vue')
let docButton: ComponentDoc
describe('tests when the file name is index', () => {
	beforeEach(async done => {
		docButton = await parse(button)
		done()
	})

	it('should take the displayName of the directory', () => {
		expect(docButton.displayName).toEqual('indexButton')
	})
})
