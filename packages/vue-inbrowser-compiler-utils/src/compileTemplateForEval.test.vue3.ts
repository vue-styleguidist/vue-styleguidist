import { describe, test, expect } from 'vitest'
import { compileTemplateForEval, compileTemplateForEvalSetup } from './compileTemplateForEval'

describe('compileTemplateForEval', () => {
	test('basic', () => {
		const compiledComponent = {
			template: '<MyButton/>',
			script: 'return { data: 1 }',
			style: '',
			setup:false
		}
		compileTemplateForEval(compiledComponent)
		expect(compiledComponent.script).toMatchInlineSnapshot(`
			"
			const Vue = require(\\"vue\\")
			const comp = (function() {return { data: 1 }})()
			comp.render = function() {const { resolveComponent: _resolveComponent, openBlock: _openBlock, createBlock: _createBlock } = Vue

			return function render(_ctx, _cache, $props, $setup, $data, $options) {
			  const _component_MyButton = _resolveComponent(\\"MyButton\\")

			  return (_openBlock(), _createBlock(_component_MyButton))
			}}
			comp.render = comp.render()
			return comp"
		`)
	})
})

describe('compileTemplateForEvalSetup', () => {
	test('basic', () => {
		const compiledComponent = {
			template: '<MyButton/>',
			script: 'return { data: 1 }',
			setup: true
		}
		compileTemplateForEvalSetup(compiledComponent, `<script setup>
		import MyButton from './MyButton.vue'
		</script>
		<template>
			<MyButton/>
		</template>`)
		expect(compiledComponent.script).toMatchInlineSnapshot(`
			"
			const Vue = require(\\"vue\\")
			const comp = (function() {return { data: 1 }})()
			comp.render = function() {const { openBlock: _openBlock, createBlock: _createBlock } = Vue

			return function render(_ctx, _cache, $props, $setup, $data, $options) {
			  return (_openBlock(), _createBlock($setup[\\"MyButton\\"]))
			}}
			comp.render = comp.render()
			return comp"
		`)
	})
})