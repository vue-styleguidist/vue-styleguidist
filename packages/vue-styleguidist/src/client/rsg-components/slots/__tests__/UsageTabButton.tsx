import React from 'react'
import { render } from '@testing-library/react'
import UsageTabButton from '../UsageTabButton'

const props = {
	name: 'Pizza',
	onClick: () => {}
}

it('should renderer a button', () => {
	const actual = render(<UsageTabButton {...props} props={{ props: [{ name: 'foo' }] }} />)

	expect(actual).toMatchSnapshot()
})

it('should renderer null if there are not props or methods', () => {
	const { queryByRole } = render(<UsageTabButton {...props} props={{}} />)

	expect(queryByRole('button')).toBeNull()
})
