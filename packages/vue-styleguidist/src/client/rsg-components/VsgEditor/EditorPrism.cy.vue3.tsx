import * as React from 'react'
import { mount } from 'cypress/react'
import Context from 'rsg-components/Context/Context'
import EditorPrism from './EditorPrism'

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

describe('EditorPrism Vue3', () => {
	it.only('renders vue SFC with script and setup', () => {
		const code = `<script lang="ts">
function test(){
  return 'hello'
}
</script>
<script lang="ts" setup>
const msg:string = test()
</script>`

		mount(
			<Provider jsxInExamples>
				<EditorPrism code={code} onChange={() => {}} />
			</Provider>
		)
	})

	it('renders vue SFC with all the features', () => {
		const code = `
<script lang="ts">
function test(){
  return 'hello'
}
</script>
<script lang="ts" setup>
const msg:string = test()
</script>
<template>
  <div>{{ msg }}</div>
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
	})
})
