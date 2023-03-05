import { expect, vi } from 'vitest'
import { parse } from '@vue/compiler-sfc'
import normalizeSfcComponent from './normalizeSfcComponent'

function evalFunction(sut: { script: string }): any {
	// eslint-disable-next-line no-new-func
	return new Function('require', sut.script)(() => ({
		default: { component: vi.fn() }
	}))
}

describe('normalizeSfcComponent', () => {
	it('bake template into a new Vue (export default)', () => {
		const sut = normalizeSfcComponent(`
<template>
<div/>
</template>
<script>
import {comp} from './comp'
const param = 'Foo'
export default {
	param
}
</script>`)
		expect(evalFunction(sut)).toMatchObject({ param: 'Foo' })
	})

	it('bake template into a new Vue (named exports)', () => {
		const sut = normalizeSfcComponent(`
<template>
<div/>
</template>
<script>
import comp from './comp'
const param = 'Foo'
export const compo = {
	param
}
</script>`)
		expect(evalFunction(sut)).toMatchObject({ param: 'Foo' })
	})

	it('bake template into a new Vue (es5 exports)', () => {
		const sut = normalizeSfcComponent(`
<template>
<div/>
</template>
<script>
const param = 'Foo'
module.exports = {
	param
}
</script>`)
		expect(evalFunction(sut)).toMatchObject({ param: 'Foo' })
	})

	it('should add const h = this.createElement at the beginning of a render function', () => {
		const sut = normalizeSfcComponent(`
<script>
export default {
render() {
	return h(Button)
},
data(){
	return {
		test:1
	}
},
computed:{
	propsSides(){
		return hello();
	}
}}
</script>`)
		expect(evalFunction(sut).render.toString()).toMatch(/const h = this\.\$createElement/)
	})

  it('compiles script setup', () => {
		const sut = normalizeSfcComponent(`
<script setup>
import { ref } from 'vue'

defineProps({})
defineEmits([])
defineExpose([])
const msg = ref('321')
const { all:names } = {all: 'foo'}
function hello() {
}
const STATUS_OK = 200
</script>`, (( source: string, opts: any ) => {
  const { descriptor } = parse(source, opts)
  return descriptor
}) as any)
		expect(evalFunction(sut).setup.toString()).toMatchInlineSnapshot(`
			"setup(){

			const vue$0 = require('vue');const ref = vue$0.ref;

			defineProps({})
			defineEmits([])
			defineExpose([])
			const msg = ref('321')
			const { all:names } = {all: 'foo'}
			function hello() {
			}
			const STATUS_OK = 200

			return {msg,names,hello,STATUS_OK}
			function defineProps(){}
			function defineEmits(){}
			function defineExpose(){}
			}"
		`)
	})

	it('exposes imported values in script setup', () => {
		const sut = normalizeSfcComponent(`
<script setup>
import { Icon } from 'vue-icon'
</script>`, (( source: string, opts: any ) => {
  const { descriptor } = parse(source, opts)
  return descriptor
}) as any)
		expect(evalFunction(sut).setup.toString()).toMatchInlineSnapshot(`
			"setup(){

			const vue_icon$0 = require('vue-icon');const Icon = vue_icon$0.Icon;

			return {}
			function defineProps(){}
			function defineEmits(){}
			function defineExpose(){}
			}"
		`)
})
})
