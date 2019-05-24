import separateScript from '../separateScript'

describe('separateScript', () => {
	// eslint-disable-next-line no-unused-vars
	let dummySet
	// eslint-disable-next-line no-unused-vars
	function __LocalVue__(param) {
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

	it('shoud be fine with using the `new __LocalVue__` structure', () => {
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

	it('shoud allow for hidden components', () => {
		const sut = separateScript(`
		const Vue = require('vue').default;
		const MyButton = require('./MyButton.vue').default;
		Vue.component('MyButton', MyButton);
		
		let param = 'BazFoo';
		<div>
			<MyButton> {{param}} </MyButton>
		</div>
		`)
		expect(sut.script).toContain("let param = 'BazFoo';")
	})
})
