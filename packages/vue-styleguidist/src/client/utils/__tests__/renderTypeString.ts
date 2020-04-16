import renderTypeString from '../renderTypeString'

describe('renderTypeString', () => {
	it('should render an Array', () => {
		expect(renderTypeString({ name: 'Array' })).toMatchInlineSnapshot(`"Array"`)
	})

	it('should render a composed type', () => {
		expect(
			renderTypeString({ name: 'Component', elements: [{ name: 'string' }, { name: 'number' }] })
		).toMatchInlineSnapshot(`"Component<string, number>"`)
	})

	it('should render a union type', () => {
		expect(
			renderTypeString({ name: 'union', elements: [{ name: 'foo' }, { name: 'bar' }] })
		).toMatchInlineSnapshot(`"foo | bar"`)
	})

	it('should render an intersection type', () => {
		expect(
			renderTypeString({ name: 'intersection', elements: [{ name: 'foo' }, { name: 'bar' }] })
		).toMatchInlineSnapshot(`"foo & bar"`)
	})
})
