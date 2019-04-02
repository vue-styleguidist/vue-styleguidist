import * as path from 'path'
import { ComponentDoc, PropDescriptor } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const button = path.join(__dirname, './Button.vue')
let docButton: ComponentDoc
describe('tests button', () => {
	beforeAll(done => {
		docButton = parse(button)
		done()
	})

	it('should return an object', () => {
		expect(typeof docButton).toEqual('object')
	})

	it('should use the name in the decorator', () => {
		expect(docButton.displayName).toEqual('ClassComponent')
	})

	it('should return propB type as string', () => {
		expect(docButton.methods).toMatchObject([{ name: 'onClick' }])
	})

	describe('props', () => {
		let props: { [propName: string]: PropDescriptor }
		beforeEach(() => {
			props = docButton.props || {}
		})
		it('should return prop bundleHash from component', () => {
			expect(props.bundleHash.type).toMatchObject({ name: 'number' })
		})

		it('should return prop color from mixin', () => {
			expect(props.color).toMatchObject({
				type: { name: 'string' },
				description: 'color of the button'
			})
		})
	})

	it('should match the snapshot', () => {
		expect(docButton).toMatchSnapshot()
	})
})
