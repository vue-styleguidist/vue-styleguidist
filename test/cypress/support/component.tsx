import 'react-styleguidist/lib/client/polyfills'
import 'react-styleguidist/lib/client/styles'
import Context, { StyleGuideContextContents } from 'react-styleguidist/lib/client/rsg-components/Context/Context'
import { mount } from 'cypress/react'
import * as React from 'react'

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
	namespace Cypress {
		interface Chainable {
			mount: typeof mount
		}
	}
}

Cypress.Commands.add(
	'mount',
	(
		JSX: Parameters<typeof mount>[0],
		options: Partial<StyleGuideContextContents> | undefined
	) => {
    const { codeRevision = 0, cssRevision = '-', config = {}, slots = {}, displayMode = 'all' } =  options || {}
		return mount(
			<Context.Provider
				value={{
					codeRevision,
					cssRevision,
					config: config as any,
					slots,
					displayMode
				}}
			>
				{JSX}
			</Context.Provider>
		)
	}
)
