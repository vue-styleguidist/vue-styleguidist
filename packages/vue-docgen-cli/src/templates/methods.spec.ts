import methods from './methods'

describe('methods', () => {
	it('escapes pipe characters in the return type and description', () => {
		const md = methods([
			{
				name: 'resolve',
				description: '',
				returns: { type: { name: 'string | number' }, description: 'a | b' }
			}
		] as any)
		// The params table escapes pipes through mdclean; the return table must do the same,
		// otherwise a union type splits the row into extra cells and the table loses data.
		expect(md).toContain('| string \\| number | a \\| b |')
	})

	it('escapes pipe characters in the params table', () => {
		const md = methods([
			{
				name: 'resolve',
				description: '',
				params: [{ name: 'value', type: { name: 'string | number' }, description: '' }]
			}
		] as any)
		expect(md).toContain('| value | string \\| number |')
	})

	it('does not leak a non-string return description into the table', () => {
		// Param['description'] is string | boolean. The params table drops a
		// non-string with a typeof guard; the return table did not, and mdclean's
		// own runtime fallback stringified it, so the column printed "true".
		const md = methods([
			{
				name: 'resolve',
				description: '',
				returns: { type: { name: 'string' }, description: true }
			}
		] as any)
		expect(md).toContain('| string |  |')
		expect(md).not.toContain('true')
	})
})
