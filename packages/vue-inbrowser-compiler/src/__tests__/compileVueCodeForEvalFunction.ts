import compileVueCodeForEvalFunction from '../compileVueCodeForEvalFunction'

describe('compileVueCodeForEvalFunction', () => {
	it('bake template into a new Vue', () => {
		const sut = compileVueCodeForEvalFunction(`
<template>
	<div/>
</template>
<script>
const param = 'Foo'
export default {
	param
}
</script>`)
		const dummySet = new Function(sut.script)()
		expect(dummySet).toMatchObject({ param: 'Foo' })
	})

	it('shoud be fine with using the `new Vue` structure', () => {
		const sut = compileVueCodeForEvalFunction(`
let param = 'Bar';
new Vue({
	param
});`)
		const dummySet = new Function(sut.script)()
		expect(dummySet).toMatchObject({ param: 'Bar' })
	})

	it('shoud work with the vsg way', () => {
		const sut = compileVueCodeForEvalFunction(`
		let param = 'BazBaz';
		<div>
			<button> {{param}} </button>
		</div>
		`)
		const dummySet = new Function(sut.script)()
		expect(dummySet.data()).toMatchObject({ param: 'BazBaz' })
	})

	it('should allow for hidden components', () => {
		const sut = compileVueCodeForEvalFunction(`
		const Vue = require('vue').default;
		const MyButton = require('./MyButton.vue').default;
		Vue.component('MyButton', MyButton);
		
		let param = 'BazFoo';
		<div>
			<MyButton> {{param}} </MyButton>
		</div>
		`)
		const dummySet = new Function('require', sut.script)(() => ({
			default: { component: jest.fn() }
		}))
		expect(dummySet.data()).toMatchObject({ param: 'BazFoo' })
	})

	it('should compile code from SFCs without a template', () => {
		const sut = compileVueCodeForEvalFunction(`
<script>
const bar = "foo"
export default {}
</script>`)
		const dummySet = sut.script
		expect(dummySet).toContain('var bar')
		expect(dummySet).not.toContain('export default')
	})

	it('should compile JSX', () => {
		const sut = compileVueCodeForEvalFunction(
			`
export default {
	render(){
		return (
			<HelloWorld />
		)
	}
}`,
			{ jsx: 'pragma' }
		)
		const dummySet = sut.script
		expect(dummySet).toContain('pragma( HelloWorld')
	})
})
