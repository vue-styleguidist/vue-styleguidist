import { compileScript, compileTemplate, isVue3 } from 'vue-inbrowser-compiler-demi'
import { EvaluableComponent } from 'vue-inbrowser-compiler-independent-utils'

const EXAMPLE_FILENAME = 'example.vue'

export function compileTemplateForEval(compiledComponent: EvaluableComponent) {
	if (compiledComponent.template) {
		const { bindings } = compileScript(
			{
				cssVars: [],
				script: {
					type: 'script',
					content: `export default (function () {${compiledComponent.script}})()`
				},
				scriptSetup: null
			},
			{
				id: '-'
			}
		)
		compiledComponent.script = `
${isVue3 ? 'const Vue = require("vue")' : ''}
const comp = (function() {${compiledComponent.script}})()
comp.render = function() {${
			compileTemplate({
				source: compiledComponent.template,
				filename: EXAMPLE_FILENAME,
				id: '-',
				compilerOptions: {
					bindingMetadata: bindings,
					prefixIdentifiers: true,
					mode: 'function'
				}
			}).code
		}}
${isVue3 ? `comp.render = comp.render()` : ``}
return comp`
		delete compiledComponent.template
	}
}
