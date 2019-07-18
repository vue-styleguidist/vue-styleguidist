import normalizeSfcComponent from '../normalizeSfcComponent'

function evalFunction(sut: { script: string }): any {
	return new Function('require', sut.script)(() => ({
		default: { component: jest.fn() }
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
		expect(evalFunction(sut)).toMatchObject({ template: '\n<div/>\n', param: 'Foo' })
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
		expect(evalFunction(sut)).toMatchObject({ template: '\n<div/>\n', param: 'Foo' })
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
		expect(evalFunction(sut)).toMatchObject({ template: '\n<div/>\n', param: 'Foo' })
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
})
