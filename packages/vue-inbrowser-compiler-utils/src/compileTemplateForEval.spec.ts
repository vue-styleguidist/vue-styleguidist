import {expect, test} from 'vitest'
import {compileTemplateForEval} from './compileTemplateForEval'

test('with normal script', () => {
	const obj = {
		script: 'export default { data() { return { msg:"hello" } } }',
		template: '<div>{{msg}}</div>'
	}
	compileTemplateForEval(obj)
	expect(obj).toMatchInlineSnapshot(`
		{
		  "script": "

		const comp = (function() {export default { data() { return { msg:\\"hello\\" } } }})()
		comp.render = function() {with(this){return _c('div',[_v(_s(msg))])}}

		return comp",
		}
	`)
})

test('with script setup', () => {
	const obj = {
		script: 'const msg = "hello"',
		template: '<div>{{msg}}</div>'
	}
	compileTemplateForEval(obj)
	expect(obj).toMatchInlineSnapshot(`
		{
		  "script": "

		const comp = (function() {const msg = \\"hello\\"})()
		comp.render = function() {with(this){return _c('div',[_v(_s(msg))])}}

		return comp",
		}
	`)
})