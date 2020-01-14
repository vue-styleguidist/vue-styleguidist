import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'
import getTestDescriptor from '../../utils/getTestDescriptor'

const InputTextDoc = path.join(__dirname, './InputTextDocumented.vue')
let docInputTextDoc: ComponentDoc

describe('tests InputTextDoc', () => {
	beforeAll(async done => {
		docInputTextDoc = await parse(InputTextDoc)
		done()
	})

	it('should return an object', () => {
		expect(typeof docInputTextDoc).toBe('object')
	})

	it('The component name should be InputTextDoc', () => {
		expect(docInputTextDoc.displayName).toEqual('InputTextDocumented')
	})

	it('The component should has a description', () => {
		expect(docInputTextDoc.description).toEqual('Description InputTextDocumented')
	})

	it('should has props', () => {
		expect(typeof docInputTextDoc.props !== 'undefined').toBe(true)
	})
	describe('props', () => {
		it('should return props in the documentation', () => {
			expect(docInputTextDoc.props && docInputTextDoc.props.map(p => p.name))
				.toMatchInlineSnapshot(`
			Array [
			  "question",
			  "importedProp",
			  "otherMixinProp",
			  "deep",
			  "placeholder",
			]
		`)
		})

		it('should give the component a placeholder prop of type string', () => {
			expect(getTestDescriptor(docInputTextDoc.props, 'placeholder').type).toEqual({
				name: 'string'
			})
		})

		it('should not give explicit prop no mixin of origin', () => {
			expect(getTestDescriptor(docInputTextDoc.props, 'placeholder').mixin).toBeUndefined()
		})

		it('should contain mixin imported props', () => {
			expect(docInputTextDoc.props && docInputTextDoc.props.map(p => p.name)).toContain(
				'importedProp'
			)
		})

		it('should contain mixin imported prop other', () => {
			expect(docInputTextDoc.props && docInputTextDoc.props.map(p => p.name)).toContain(
				'otherMixinProp'
			)
		})

		it('should contain mixin imported prop from multiple layers of imports', () => {
			expect(docInputTextDoc.props && docInputTextDoc.props.map(p => p.name)).toContain('deep')
		})
	})

	it('should match the snapshot', () => {
		expect(docInputTextDoc).toMatchSnapshot()
	})
})
