import * as React from 'react'
import { mount } from 'cypress/react'
import Context from 'rsg-components/Context'
import slots from 'rsg-components/slots'
import Fixture from 'rsg-components/VsgReactComponent/Fixture'
import Preview from './Preview'

const _require = () => React

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

const evalInContext = (a: string) =>
	// eslint-disable-next-line no-new-func
	new Function('require', 'const React = require("react");' + a).bind(null, _require)

describe('Preview', { viewportHeight: 680 }, () => {
	it('renders a Vue Component with one head', () => {
		mount(
			<div style={{ padding: '24px' }}>
				<Provider>
					<Preview
						depth={1}
						usageMode="expand"
						exampleMode="expand"
						component={Fixture as any}
						code={`<button>Code: OK</button>`}
						evalInContext={evalInContext}
					/>
				</Provider>
			</div>
		)
		cy.get('button').should('have.length', 1)
	})

	it('renders a Vue Component with two heads', () => {
		mount(
			<div style={{ padding: '24px' }}>
				<Provider>
					<Preview
						depth={1}
						usageMode="expand"
						exampleMode="expand"
						component={Fixture as any}
						code={`
              <button>1st Button</button>
              <button>2nd Button</button>
            `}
						evalInContext={evalInContext}
					/>
				</Provider>
			</div>
		)

		cy.get('button').should('have.length', 2)
	})
})
