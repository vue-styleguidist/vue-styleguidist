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
			const Vue = require(\\"vue\\");const {pushScopeId: _pushScopeId, popScopeId: _popScopeId} = Vue
			const __sfc__ = (function() {return { data: 1 }})()
			  __sfc__.render = function() {const { resolveComponent: _resolveComponent, openBlock: _openBlock, createBlock: _createBlock } = Vue

			return function render(_ctx, _cache, $props, $setup, $data, $options) {
			  const _component_MyButton = _resolveComponent(\\"MyButton\\")

			  return (_openBlock(), _createBlock(_component_MyButton))
			}}


			__sfc__.render = __sfc__.render()

			return __sfc__"
		`)
	})

	test('double header style should scope each block', () => {
		const compiledComponent = {
			template: `<svg><path/></svg><div class="test">T</div><div class="test2">T2</div>`,
			script: 'return { data: 1 }',
			style: '.test { color: red; } .test2 { color: blue; }',
			setup: false,
      scopeId: 'data-v-123456'
		}
		compileTemplateForEval(compiledComponent)
		expect(compiledComponent.script).toMatchInlineSnapshot(`
			"
			const Vue = require(\\"vue\\");const {pushScopeId: _pushScopeId, popScopeId: _popScopeId} = Vue
			const __sfc__ = (function() {return { data: 1 }})()
			  __sfc__.render = function() {const { createElementVNode: _createElementVNode, Fragment: _Fragment, openBlock: _openBlock, createElementBlock: _createElementBlock } = Vue

			const _hoisted_1 = /*#__PURE__*/_createElementVNode(\\"svg\\", null, [
			  /*#__PURE__*/_createElementVNode(\\"path\\")
			], -1 /* HOISTED */)
			const _hoisted_2 = /*#__PURE__*/_createElementVNode(\\"div\\", { class: \\"test\\" }, \\"T\\", -1 /* HOISTED */)
			const _hoisted_3 = /*#__PURE__*/_createElementVNode(\\"div\\", { class: \\"test2\\" }, \\"T2\\", -1 /* HOISTED */)

			return function render(_ctx, _cache, $props, $setup, $data, $options) {
			  return (_openBlock(), _createElementBlock(_Fragment, null, [
			    _hoisted_1,
			    _hoisted_2,
			    _hoisted_3
			  ], 64 /* STABLE_FRAGMENT */))
			}}

			_pushScopeId(\\"data-v-123456\\")
			__sfc__.render = __sfc__.render()
			_popScopeId()
			return __sfc__"
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
			const Vue = require(\\"vue\\");const {pushScopeId: _pushScopeId, popScopeId: _popScopeId} = Vue
			const __sfc__ = (function() {return { data: 1 }})()
			  __sfc__.render = function() {const { openBlock: _openBlock, createBlock: _createBlock } = Vue

			return function render(_ctx, _cache, $props, $setup, $data, $options) {
			  return (_openBlock(), _createBlock($setup[\\"MyButton\\"]))
			}}


			__sfc__.render = __sfc__.render()

			return __sfc__"
		`)
	})

  test('double header style should scope each block', () => {
		const compiledComponent = {
			template: '<div class="test">T</div><div class="test2">T2</div>',
			script: 'return { data: 1 }',
			style: '.test { color: red; } .test2 { color: blue; }',
			setup: true,
      scopeId: 'data-v-123456'
		}
		compileTemplateForEvalSetup(compiledComponent, `<script setup>
		import MyButton from './MyButton.vue'
		</script>
		<template>
			<MyButton/>
		</template>
    <style scoped>
    .test { color: red; } 
    .test2 { color: blue; }
    </style>`)
		expect(compiledComponent.script).toMatchInlineSnapshot(`
			"
			const Vue = require(\\"vue\\");const {pushScopeId: _pushScopeId, popScopeId: _popScopeId} = Vue
			const __sfc__ = (function() {return { data: 1 }})()
			  __sfc__.render = function() {const { createElementVNode: _createElementVNode, Fragment: _Fragment, openBlock: _openBlock, createElementBlock: _createElementBlock } = Vue

			const _hoisted_1 = /*#__PURE__*/_createElementVNode(\\"div\\", { class: \\"test\\" }, \\"T\\", -1 /* HOISTED */)
			const _hoisted_2 = /*#__PURE__*/_createElementVNode(\\"div\\", { class: \\"test2\\" }, \\"T2\\", -1 /* HOISTED */)

			return function render(_ctx, _cache, $props, $setup, $data, $options) {
			  return (_openBlock(), _createElementBlock(_Fragment, null, [
			    _hoisted_1,
			    _hoisted_2
			  ], 64 /* STABLE_FRAGMENT */))
			}}

			_pushScopeId(\\"data-v-123456\\")
			__sfc__.render = __sfc__.render()
			_popScopeId()
			return __sfc__"
		`)
	})
})