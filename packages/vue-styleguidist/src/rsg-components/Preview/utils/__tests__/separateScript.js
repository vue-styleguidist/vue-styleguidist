import separateScript from '../separateScript'

describe('separateScript', () => {
	// eslint-disable-next-line no-unused-vars
	let dummySet
	// eslint-disable-next-line no-unused-vars
	function Vue(param) {
		dummySet = param
	}
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
		eval(sut.script)
		expect(dummySet).toMatchObject({ param: 'Foo' })
	})

	it('shoud be fine with using the `new Vue` structure', () => {
		const sut = separateScript(`
let param = 'Bar';
new Vue({
	param
});`)
		eval(sut.script)
		expect(dummySet).toMatchObject({ param: 'Bar' })
	})

	it('shoud work with the vsg way', () => {
		const sut = separateScript(`
		let param = 'BazBaz';
		<div>
			<button> {{param}} </button>
		</div>
		`)
		expect(sut.script.trim()).toBe("let param = 'BazBaz';")
	})
})
