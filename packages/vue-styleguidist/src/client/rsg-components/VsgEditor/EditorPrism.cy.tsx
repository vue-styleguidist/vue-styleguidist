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
			<Provider jsxInExamples>
				<EditorPrism code={code} onChange={() => {}} />
			</Provider>
		)
	})

	it('renders vue SFC with Typescript', () => {
		const code = `
<template>
  <div @click="foo()">bar</div>
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
	})
})
