import { transform } from 'sucrase'
import { parse } from '@vue/compiler-sfc'
import normalizeSfcComponent, { parseScriptCode } from './normalizeSfcComponent'

function evalFunction(sut: { script: string }): any {
	// eslint-disable-next-line no-new-func
	const scriptTransformed = transform(`{${sut.script}}`, {
		transforms: ['imports', 'typescript'],
		production: true
	}).code
	return new Function('require', scriptTransformed)(() => ({
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

	it('should parse typescript components', () => {
		const sut = normalizeSfcComponent(`
<script lang="ts">
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  render(props: any) {
    return h('div', this.msg)
  }
}
</script>`)

		expect(() => evalFunction(sut)).not.toThrow()
	})
})

describe('parseScriptCode', () => {
	it('should return component code', () => {
		const ret = parseScriptCode(`
    export default () => {
      return <div>Hello</div>
    }`)

		expect(ret).toMatchInlineSnapshot(`
      {
        "component": "render: () => {
            return <div>Hello</div>
          }",
        "postprocessing": "",
        "preprocessing": "
          ",
      }
    `)
	})

	it('should replace spreads by concatenate', () => {
		const ret = parseScriptCode(`
    export default () => {
      return <div class='b' {...{class: 'a', style:{color:'blue'}}}>Hello</div>
    }`)

		expect(ret).toMatchInlineSnapshot(`
      {
        "component": "render: () => {
            return <div {...Object.assign({class:\\"b\\"},{class: 'a', style:{color:'blue'}})} >Hello</div>
          }",
        "postprocessing": "",
        "preprocessing": "
          ",
      }
    `)
	})

	it('should replace spreads by concatenate on self closing tags', () => {
		const ret = parseScriptCode(`
    export default () => {
      return <CouCou class='b' {...{class: 'a', style:{color:'blue'}}} />
    }`)

		expect(ret).toMatchInlineSnapshot(`
      {
        "component": "render: () => {
            return <CouCou {...Object.assign({class:\\"b\\"},{class: 'a', style:{color:'blue'}})} />
          }",
        "postprocessing": "",
        "preprocessing": "
          ",
      }
    `)
	})

	it('should return a full function', () => {
		const ret = parseScriptCode(`
    export default function (){
      return <CouCou class='b' style={{background:"gray"}} {...{class: 'a', style:{color:'blue'}}} />
    }`)

		expect(ret).toMatchInlineSnapshot(`
      {
        "component": "render: function (){
            return <CouCou {...Object.assign({class:\\"b\\"},{style:{background:\\"gray\\"}},{class: 'a', style:{color:'blue'}})} />
          }",
        "postprocessing": "",
        "preprocessing": "
          ",
      }
    `)
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

			var _vue = require('vue');

			defineProps({})
			defineEmits([])
			defineExpose([])
			const msg = _vue.ref.call(void 0, '321')
			const { all:names } = {all: 'foo'}
			function hello() {
			}
			const STATUS_OK = 200

			return {ref: _vue.ref,msg,names,hello,STATUS_OK}
			function defineProps(props){ return props;}
			function defineEmits(){ return function emit() {}}
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

			var _vueicon = require('vue-icon');

			return {Icon: _vueicon.Icon}
			function defineProps(props){ return props;}
			function defineEmits(){ return function emit() {}}
			function defineExpose(){}
			}"
		`)
	})
})
