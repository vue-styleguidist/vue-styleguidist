import defaultExample from '../defaultExample'

describe('defaultExample', () => {
	it('should match each prop type with its default', () => {
		expect(
			defaultExample({
				displayName: 'my-component',
				exportName: 'default',
				props: [
					{
						name: 'string',
						required: true,
						type: { name: 'string' },
						tags: {},
						description: ''
					},
					{
						name: 'number',
						required: true,
						type: { name: 'number' },
						tags: {},
						description: ''
					},
					{
						name: 'boolean',
						required: true,
						type: { name: 'boolean' },
						tags: {},
						description: ''
					},
					{
						name: 'array',
						required: true,
						type: { name: 'array' },
						tags: {},
						description: ''
					},
					{
						name: 'object',
						required: true,
						type: { name: 'object' },
						tags: {},
						description: ''
					},
					{ name: 'date', required: true, type: { name: 'date' }, tags: {}, description: '' },
					{
						name: 'function',
						required: true,
						type: { name: 'func' },
						tags: {},
						description: ''
					},
					{
						name: 'symbol',
						required: true,
						type: { name: 'symbol' },
						tags: {},
						description: ''
					}
				]
			})
		).toMatchInlineSnapshot(`
		"
		\`\`\`vue live
		<my-component string=\\"Default Example Usage\\"  :number=\\"42\\"  :boolean=\\"true\\"  :array=\\"[1, 2, 3]\\"  :object=\\"{}\\"  :date=\\"new Date('2012-12-12')\\"  :function=\\"() => void\\"  :symbol=\\"Default Example Usage\\" />
		\`\`\`
			"
	`)
	})

	it('should use the default slot if provided', () => {
		expect(
			defaultExample({
				displayName: 'my-component',
				exportName: 'default',
				slots: [{ name: 'default', description: '' }]
			})
		).toMatchInlineSnapshot(`
		"
		\`\`\`vue live
		<my-component>Default Example Usage</my-component>
		\`\`\`
			"
	`)
	})

	it('should remove all invalid character', () => {
		expect(
			defaultExample({
				displayName: "it's my component",
				exportName: 'default',
				tags: {},
				slots: [{ name: 'default', description: '' }]
			})
		).toMatchInlineSnapshot(`
		"
		\`\`\`vue live
		<itsmycomponent>Default Example Usage</itsmycomponent>
		\`\`\`
			"
	`)
	})
})
