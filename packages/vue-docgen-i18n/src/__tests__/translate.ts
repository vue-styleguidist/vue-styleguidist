import translate from '../translate'

describe('translate', () => {
	it('translate all description', () => {
		const obj = translate(
			{
				displayName: 'bar',
				exportName: 'default',
				props: [{ name: 'foo', description: 'EN-1' }, { name: 'bar', description: 'EN-2' }]
			},
			{ props: [{ name: 'foo', description: 'FR-1' }] }
		)
		expect((obj.props as any)[0].description).toEqual('FR-1')
	})
})
