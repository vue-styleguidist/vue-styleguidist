import * as React from 'react'
import { mount } from 'cypress/react'
import Context from 'rsg-components/Context'
import slots from 'rsg-components/slots'
import ReactComponent from './ReactComponent'
import Fixture from './Fixture'

const Provider = ({ children, jssThemedEditor = true, jsxInExamples = false }) => {
	const config = {
		usageMode: 'expand',
		exampleMode: 'expand',
		jssThemedEditor,
		jsxInExamples,
		pagePerSection: true
	}

	return (
		<Context.Provider
			value={
				{
					slots: slots(config as any),
					config
				} as any
			}
		>
			{children}
		</Context.Provider>
	)
}

describe('ReactComponent', {viewportHeight: 680}, () => {
	it('renders a Vue Component with props/slots/methods/exposed', () => {
		mount(
      <div style={{padding:'24px'}}>
			<Provider>
				<ReactComponent
					depth={1}
					usageMode="expand"
					exampleMode="expand"
					component={Fixture as any}
				/>
			</Provider>
      </div>
		)
	})
})
