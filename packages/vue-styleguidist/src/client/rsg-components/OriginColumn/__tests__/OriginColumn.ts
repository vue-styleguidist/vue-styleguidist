import { render } from '@testing-library/react'
import getOriginColumn from '../OriginColumn'

describe('OriginColumn', () => {
	it('should return an empty array if no props have origins', () => {
		expect(getOriginColumn([{ name: 'foo' }, { name: 'bar' }] as any)).toEqual([])
	})

	it('should return a colum array to render ', () => {
		const props = [
			{ name: 'foo', mixin: { name: 'myMixin', path: 'mixin/path' } },
			{ name: 'bar', extends: { name: 'myExtends', path: 'extends/path' } }
		]
		const columns = getOriginColumn(props)
		expect(columns.length).toBe(1)

		const renderv = columns[0].render(props[0])
		if (renderv) {
			const { getByText } = render(renderv)
			expect(getByText('mixin: myMixin')).toMatchInlineSnapshot(`
			<div
			  title="mixin/path"
			>
			  mixin: 
			  myMixin
			</div>
		`)
		}
		expect(renderv).not.toBeUndefined()
	})
})
