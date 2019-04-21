import separateScript from '../separateScript'

describe('separateScript', () => {
	// eslint-disable-next-line no-unused-vars
	let __component__
	it('bake template into a new Vue', () => {
		const sut = separateScript(`
<template>
	<div/>
</template>
<script>
const param = 'Foo'
export default {
	param
}
</script>`)
		eval(`${sut.js};${sut.vueComponent}`)
		expect(__component__).toMatchObject({ param: 'Foo' })
	})

	it('shoud be fine with using the new Vue structure', () => {
		const sut = separateScript(`
let param = 'Bar';
new Vue({
	param
});`)
		eval(`${sut.js};${sut.vueComponent}`)
		expect(__component__).toMatchObject({ param: 'Bar' })
	})
})
