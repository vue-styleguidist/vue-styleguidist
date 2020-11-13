import normalizeSfcComponent from '../normalizeSfcComponent'

function evalFunction(sut: { script: string }): any {
	// eslint-disable-next-line no-new-func
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
		expect(evalFunction(sut)).toMatchObject({ param: 'Foo' })
		expect(sut.template?.trim()).toBe('<div/>')
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
		expect(sut.template?.trim()).toBe('<div/>')
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
		expect(sut.template?.trim()).toBe('<div/>')
	})
})
