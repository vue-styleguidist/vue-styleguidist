import * as React from 'react'
import { mount } from 'cypress/react'
import EditorPrism from './EditorPrism'

describe('EditorPrism', () => {
	it('renders', () => {
    const code = 
    `
<BestButton size="large" color="deeppink">
  Click Me
</BestButton>
<br />
<BestButton size="small" color="blue">
  Second button
</BestButton>
    `
		mount(<EditorPrism code={code} onChange={() => {}} />, {
      config:{
        jssThemedEditor: {}, 
        jsxInExamples: true
      }})
	})
})
