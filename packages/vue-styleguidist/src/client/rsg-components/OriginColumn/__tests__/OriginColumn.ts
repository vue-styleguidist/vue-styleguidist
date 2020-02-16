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

		const renderedColumn1 = columns[0].render(props[0])
		const renderedColumn2 = columns[0].render(props[1])
		if (renderedColumn1 && renderedColumn2) {
			const { getByText: c1 } = render(renderedColumn1)
			expect(c1('M: myMixin')).toMatchInlineSnapshot(`
			<span
			  title="mixin: mixin/path"
			>
			  M: 
			  myMixin
			</span>
		`)
			const { getByText: c2 } = render(renderedColumn2)
			expect(c2('E: myExtends')).toMatchInlineSnapshot(`
			<span
			  title="extends: extends/path"
			>
			  E: 
			  myExtends
			</span>
		`)
		}
		expect(renderedColumn1).not.toBeUndefined()
		expect(renderedColumn2).not.toBeUndefined()
	})
})
