import React from 'react'
import { render } from '@testing-library/react'
import JsDoc from '../JsDoc'

const tags = {
	deprecated: [
		{
			title: 'description',
			description: 'Use *another* method'
		}
	],
	version: [
		{
			title: 'version',
			description: '2.0.0'
		}
	],
	since: [
		{
			title: 'since',
			description: '1.0.0'
		}
	],
	author: [
		{
			title: 'author',
			description: '[Author 1](#TestLink)'
		},
		{
			title: 'author',
			description: '[Author 2](#TestLink2)'
		}
	],
	see: [
		{
			title: 'see',
			description: '[See 1](#TestLink)'
		},
		{
			title: 'see',
			description: '[See 2](#TestLink2)'
		}
	],
	link: [
		{
			title: 'link',
			description: '[Link 1](#TestLink)'
		}
	]
}

describe('JsDoc', () => {
	it('should render Markdown', () => {
		const actual = render(<JsDoc {...tags} />)

		expect(actual.container).toMatchSnapshot()
	})

	it('should render null for empty tags', () => {
		const actual = render(<JsDoc />)

		expect(actual.container.innerHTML).toBe('')
	})
})
