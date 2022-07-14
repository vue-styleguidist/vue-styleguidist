import * as React from 'react'
import { mount } from 'cypress/react'
import 'react-styleguidist/lib/client/styles'
import 'react-styleguidist/lib/client/polyfills'
import { RecursivePartial } from 'react-styleguidist/lib/typings/RecursivePartial'
import Context, { StyleGuideContextContents } from 'rsg-components/Context/Context'

export const mountWithContext = (
	JSX: Parameters<typeof mount>[0],
	options?: RecursivePartial<Omit<StyleGuideContextContents, 'config'>> & { config?: any }
) => {
	options = Object.assign(
		{
			codeRevision: 1,
			cssRevision: '1',
			config: {},
			slots: {},
			displayMode: 'collapse'
		},
		options
	)
	debugger
	return mount(
		<Context.Provider value={options as any}>
			<>{JSX}</>
		</Context.Provider>
	)
}

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
	namespace Cypress {
		interface Chainable {
			mount: typeof mountWithContext
		}
	}
}

Cypress.Commands.add('mount', mountWithContext)
