import React from 'react'
import { render } from '@testing-library/react'
import SubComponents from '../SubComponents'

describe('JsDoc', () => {
	it('should render Markdown', () => {
		const actual = render(<SubComponents subComponents={[{ name: 'option', url: '#comp/options' }]} />)

		expect(actual.container).toMatchSnapshot()
	})
})
