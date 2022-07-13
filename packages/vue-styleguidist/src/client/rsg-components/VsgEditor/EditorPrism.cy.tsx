import * as React from 'react'
import { mount } from 'cypress/react'
import EditorPrism from './EditorPrism'

describe('EditorPrism', () => {
	it('renders', () => {
		mount(<EditorPrism code="const a = 1" onChange={() => {}} />)
	})
})
