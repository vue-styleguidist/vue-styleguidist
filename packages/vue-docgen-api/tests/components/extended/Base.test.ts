import * as path from 'path'
import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'

const Base = path.join(__dirname, './Base.vue')
let docBase: ComponentDoc

describe('tests Base', () => {
	beforeAll(async done => {
		docBase = await parse(Base)
		done()
	})

	it('should return an object', () => {
		expect(typeof docBase).toBe('object')
	})

	it('The component name should be Base', () => {
		expect(docBase.displayName).toEqual('Base')
	})

	it('The component should has a description', () => {
		expect(docBase.description).toEqual('')
	})

	it('should has props', () => {
		expect(docBase.props).not.toBeUndefined()
	})

	it('should return two props in the documentation', () => {
		expect(docBase.props && docBase.props.map(p => p.name)).toMatchInlineSnapshot(`
		Array [
		  "question",
		]
	`)
	})
})
