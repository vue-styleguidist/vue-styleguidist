import * as React from 'react'
import { mount } from 'cypress/react'
import Context from 'rsg-components/Context/Context'
import EditorPrism from './EditorPrism'

type ProviderProps = {
  children?: React.ReactNode
  jssThemedEditor?: boolean
  jsxInExamples?: boolean
};

const Provider: React.FC<ProviderProps> = ({ children, jssThemedEditor = true, jsxInExamples = false }) => (
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

    cy.contains('.token.function', 'foo').should('be.visible')
	})

	it('renders tsx', () => {
		const code = `
function foo() :string {
  return <Foo>bar</Foo>
}

foo()
    `
		mount(
			<Provider jsxInExamples>
				<EditorPrism code={code} onChange={() => {}} />
			</Provider>
		)

    cy.contains('.token.tag', 'Foo').should('be.visible')

    cy.get('pre').should('have.text', code)
	})

	it('renders vue SFC with Typescript', () => {
		const code = `
<template>
  <Accordion @click="foo()">bar</Accordion>
</template>
<script lang="ts">
import type { Vue } from 'vue'
function foo(param: Vue) : { one: number, two: boolean } {
  return 'bar'
}
</script>
    `
		mount(
			<Provider jsxInExamples>
				<EditorPrism code={code} onChange={() => {}} />
			</Provider>
		)

    cy.contains('.token.tag', 'Accordion').should('be.visible')

    cy.get('pre').should('have.text', code)
	})

  it('renders vue SFC with Self-closing tag', () => {
		const code = `
<template>
  <Checkbox />
</template>
<script lang="ts">
import type { Vue } from 'vue'

function foo(param: Vue) : { one: number, two: boolean } {
  return 'bar'
}
</script>
    `
		mount(
			<Provider jsxInExamples>
				<EditorPrism code={code} onChange={() => {}} />
			</Provider>
		)

    cy.contains('.token.tag', 'Checkbox').should('be.visible')

    cy.get('pre').should('have.text', code)
	})

  it('renders vue SFC with style scoped tag', () => {
		const code = `
<template>
  <Checkbox />
</template>
<style scoped>
  .checkbox {
    color: red;
  }
</style>
    `
		mount(
			<Provider jsxInExamples>
				<EditorPrism code={code} onChange={() => {}} />
			</Provider>
		)

    cy.contains('.token.tag', 'Checkbox').should('be.visible')

    cy.get('pre').should('have.text', code)
	})
})
