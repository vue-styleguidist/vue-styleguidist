/* eslint-disable no-new-func */
import compile from '../compileVueCodeForEvalFunction'

describe('compileVueCodeForEvalFunction', () => {
	it('bake template into a new Vue', () => {
		const sut = compile(`
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

	it('shoud work with the vsg way', () => {
		const sut = compile(`
		let param = 'BazBaz';
		<div>
			<button> {{param}} </button>
		</div>
		`)
		const dummySet = new Function(sut.script)()
		expect(dummySet.data()).toMatchObject({ param: 'BazBaz' })
	})

	it('shoud compile imports in the vsg way', () => {
		const sut = compile(`
		import param from "baz-baz";
		<button> {{param}} </button>
		`)
		expect(sut.script).toMatchInlineSnapshot(`
		"
				const baz_baz$0 = require('baz-baz');const param = baz_baz$0.default || baz_baz$0;;return {data:function(){return {param:param};}}"
	`)
	})

	it('should allow for hidden components', () => {
		const sut = compile(`
		const Vue = require('vue').default;
		const MyButton = require('./MyButton.vue').default;
		Vue.component('MyButton', MyButton);
		
		let param = 'BazFoo';
		<div>
			<MyButton> {{param}} </MyButton>
		</div>
		`)
		const component = jest.fn()
		const dummySet = new Function('require', sut.script)(() => ({
			default: { component }
		}))
		expect(component).toHaveBeenCalledWith('MyButton', expect.any(Object))
		expect(dummySet.data()).toMatchObject({ param: 'BazFoo' })
	})

	it('should compile JSX', () => {
		const sut = compile(
			`
export default {
	render(){
		return (
			<HelloWorld />
		)
	}
}`,
			true
		)
		const dummySet = sut.script
		expect(dummySet).toContain('h(HelloWorld')
	})

	it('shoud fail if the sfc script has a parsing issue', () => {
		expect(() =>
			compile(`
		<template>
			<div>
				<button> {{param}} </button>
			</div>
		</template>
		<script>
		let param% = 'BazBaz';
		export default {
			data(){
				return {param: param%}
			}
		}
		</script>
		`)
		).toThrowErrorMatchingInlineSnapshot(`"Unexpected token (8:11)"`)
	})

	it('shoud try to run the with the same lines', () => {
		expect(
			compile(`<template>
			<div/>
		</template>
		<script>
		export default {
			data(){
				return {
					param: 'BazBaz'
				}
			}
		}
		</script>
		`).script
		).toMatchInlineSnapshot(`
		"



				;;return {
					data(){
						return {
							param: 'BazBaz'
						}
					}
				};
				"
	`)
	})
})
