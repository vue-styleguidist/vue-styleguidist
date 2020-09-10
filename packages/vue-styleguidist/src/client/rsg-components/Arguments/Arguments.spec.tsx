import React from 'react'
import { render } from '@testing-library/react'
import { ArgumentsRenderer, styles } from './ArgumentsRenderer'

const props = {
	classes: Object.keys(styles({} as any)).reduce((a: Record<string, string>, cl: string) => {
		a[cl] = cl
		return a
	}, {})
}

const args = [
	{
		name: 'Foo',
		description: 'Converts foo to bar',
		type: { name: 'Array' }
	},
	{
		name: 'Foo'
	}
]

it('renderer should render arguments', () => {
	const actual = render(<ArgumentsRenderer {...props} args={args} />)

	expect(actual.container).toMatchSnapshot()
})

it('renderer should render heading', () => {
	const actual = render(<ArgumentsRenderer {...props} args={[args[1]]} heading />)

	expect(actual.container).toMatchSnapshot()
})

it('renderer should render nothing for empty array', () => {
	const actual = render(<ArgumentsRenderer {...props} args={[]} />)

	expect(actual.container).toBe(null)
})
