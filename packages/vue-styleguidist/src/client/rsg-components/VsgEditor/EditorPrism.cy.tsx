import * as React from 'react'
import { mount } from 'cypress/react'
import EditorPrism from './EditorPrism'
import Context from 'rsg-components/Context/Context'

const Provider = ({ children, jssThemedEditor = true, jsxInExamples = false }) => (
	<Context.Provider
		value={
			{
				config: {
					jssThemedEditor,
					jsxInExamples
				}
			} as any
		}
	>
		{children}
	</Context.Provider>
)

describe('EditorPrism', () => {
	it('renders typescript', () => {
		const code = `
function foo() :string {
  return 'bar'
}

foo()
    `
		mount(
			<Provider>
				<EditorPrism code={code} onChange={() => {}} />
			</Provider>
		)
	})

	it('renders tsx', () => {
		const code = `
function foo() :string {
  return <div>bar</div>
}

foo()
    `
		mount(
			<Provider jsxInExamples={true}>
				<EditorPrism code={code} onChange={() => {}} />
			</Provider>
		)
	})
})
