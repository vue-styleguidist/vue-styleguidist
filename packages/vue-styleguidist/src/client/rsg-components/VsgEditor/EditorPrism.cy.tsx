import * as React from 'react'
import { mount } from 'cypress/react'
import EditorPrism from './EditorPrism'
import Context from 'rsg-components/Context/Context'

const Provider = ({ children }) => (
	<Context.Provider
		value={
			{
				config: {
					jssThemedEditor: true,
					jsxInExamples: true
				}
			} as any
		}
	>
		{children}
	</Context.Provider>
)

describe('EditorPrism', () => {
	it('renders', () => {
		const code = `
<BestButton size="large" color="deeppink">
  Click Me
</BestButton>
<br />
<BestButton size="small" color="blue">
  Second button
</BestButton>
    `
		mount(
			<Provider>
				<EditorPrism code={code} onChange={() => {}} />
			</Provider>
		)
	})
})
