import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const InputText = path.join(__dirname, './LocallyExtended.ts')
let docLocalExtend: ComponentDoc

describe('local extension of component', () => {
	beforeAll(async () => {
		docLocalExtend = await parse(InputText)
	})

	it('should have a prop title', () => {
		expect(docLocalExtend.props).toMatchObject([{ name: 'title' }])
	})
})
