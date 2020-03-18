import React from 'react'
import { render } from '@testing-library/react'
import CodeTabButton from '../CodeTabButton'

it('should renderer a link to isolated mode', () => {
	const actual = render(<CodeTabButton name="Pizza" onClick={() => {}} active={true} />)

	expect(actual.container).toMatchInlineSnapshot(`
		<div>
		  <button
		    aria-pressed="true"
		    class="rsg--button-0 rsg--isActive-1"
		    name="Pizza"
		    type="button"
		  >
		    View Code
		  </button>
		</div>
	`)
})
