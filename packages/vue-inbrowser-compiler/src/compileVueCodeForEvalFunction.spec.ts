/* eslint-disable no-new-func */
import compileVueCodeForEvalFunction from './compileVueCodeForEvalFunction'

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

	it('should work with the vsg way', () => {
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
			default: { component: vi.fn() }
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
		expect(dummySet).toContain('const bar')
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

	it('should combine import and new vue', () => {
		const sut = compileVueCodeForEvalFunction(`
import Vue from 'vue'
import three from '../RandomButton/dog-names'

new Vue({
	data() {
		let i = 0
		return {
			opt: three.map(a => ({ text: a, value: i++ }))
		}
	},
	template: '<Radio :options="opt" />'
})
		`)

		expect(sut.script).toMatchInlineSnapshot(`
			"
			const vue$0 = require('vue');const Vue = vue$0.default || vue$0;
			const dog_names$43 = require('../RandomButton/dog-names');const three = dog_names$43.default || dog_names$43;

			;return {
				data() {
					let i = 0
					return {
						opt: three.map(a => ({ text: a, value: i++ }))
					}
				},
				template: '<Radio :options=\\"opt\\" />'
			}"
		`)
	})

	it('should fail if the sfc script has a parsing issue', () => {
		expect(() =>
			compileVueCodeForEvalFunction(`
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

	it('should try to run the with the same lines', () => {
		expect(
			compileVueCodeForEvalFunction(`<template>
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



					;return {template: \`
						<div/>
					\`, 
						data(){
							return {
								param: 'BazBaz'
							}
						}
					};
					"
		`)
	})

	it('should escape template correctly', () => {
		let sut = compileVueCodeForEvalFunction(`
<template>
	<div>{{ \`\${value}\` }}</div>
</template>
<script>
export default {
	data () {
		return {
			value: 1
		}
	}
}
</script>`)
		expect(() => new Function(sut.script)()).not.toThrow()
	})
})
