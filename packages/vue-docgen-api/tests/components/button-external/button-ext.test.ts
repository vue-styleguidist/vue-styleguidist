import * as path from 'path'
import { ComponentDoc, PropDescriptor } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const button = path.join(__dirname, './Button.vue')
let docButton: ComponentDoc
describe('tests button', () => {
	beforeAll(async done => {
		docButton = await parse(button)
		done()
	})

	it('should return an object', () => {
		expect(typeof docButton).toEqual('object')
	})

	it('should return propB type as string', () => {
		expect(docButton.methods).toMatchObject([{ name: 'onClick' }])
	})

	it('should return slots definitions', () => {
		expect(docButton.slots).toMatchObject({
			default: { description: 'Use this slot default' },
			empty: { description: 'Use this slot for not button' }
		})
	})

	describe('props', () => {
		let props: { [propName: string]: PropDescriptor }
		beforeEach(() => {
			props = docButton.props || {}
		})
		it('should return propNoType type as string', () => {
			expect(props.propNoType.type).toMatchObject({ name: 'string' })
		})

		it('should return propA type as number', () => {
			expect(props.propA.type).toMatchObject({ name: 'number' })
		})

		it('should return propB type as string', () => {
			expect(props.propB.type).toMatchObject({ name: 'string' })
		})
	})

	it('should match the snapshot', () => {
		expect(docButton).toMatchSnapshot()
	})
})
