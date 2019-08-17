import defaultExample from '../defaultExample'

describe('defaultExample', () => {
	it('should match each prop type with its default', () => {
		expect(
			defaultExample({
				displayName: 'my-component',
				tags: {},
				slots: {},
				methods: [],
				props: {
					string: {
						name: 'string',
						required: true,
						type: { name: 'string' },
						tags: {},
						description: ''
					},
					number: {
						name: 'number',
						required: true,
						type: { name: 'number' },
						tags: {},
						description: ''
					},
					boolean: {
						name: 'boolean',
						required: true,
						type: { name: 'boolean' },
						tags: {},
						description: ''
					},
					array: {
						name: 'array',
						required: true,
						type: { name: 'array' },
						tags: {},
						description: ''
					},
					object: {
						name: 'object',
						required: true,
						type: { name: 'object' },
						tags: {},
						description: ''
					},
					date: { name: 'date', required: true, type: { name: 'date' }, tags: {}, description: '' },
					function: {
						name: 'function',
						required: true,
						type: { name: 'func' },
						tags: {},
						description: ''
					},
					symbol: {
						name: 'symbol',
						required: true,
						type: { name: 'symbol' },
						tags: {},
						description: ''
					}
				}
			})
		).toMatchInlineSnapshot(`
						"
						\`\`\`vue live
						  <my-component string=\\"lorem ipsum\\"  number=\\"42\\"  boolean=\\"true\\"  array=\\"[1, 2, 3]\\"  object=\\"{}\\"  date=\\"new Date('2012-12-12')\\"  function=\\"() => void\\"  symbol=\\"lorem ipsum\\"/>
						\`\`\`
						"
			`)
	})

	it('should use the default slot if provided', () => {
		expect(
			defaultExample({
				displayName: 'my-component',
				tags: {},
				slots: { default: { description: '' } },
				methods: [],
				props: {}
			})
		).toMatchInlineSnapshot(`
				"
				\`\`\`vue live
				  <my-component>lorem ipsum</my-component>
				\`\`\`
				"
		`)
	})

	it('should remove all invalid character', () => {
		expect(
			defaultExample({
				displayName: "it's my component",
				tags: {},
				slots: { default: { description: '' } },
				methods: [],
				props: {}
			})
		).toMatchInlineSnapshot(`
		"
		\`\`\`vue live
		  <itsmycomponent>lorem ipsum</itsmycomponent>
		\`\`\`
		"
	`)
	})
})
