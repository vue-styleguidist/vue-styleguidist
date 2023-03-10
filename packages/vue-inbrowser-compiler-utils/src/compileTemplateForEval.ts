import { compileScript, compileTemplate, isVue3, parseComponent } from 'vue-inbrowser-compiler-demi'
import { EvaluableComponent } from 'vue-inbrowser-compiler-independent-utils'

const EXAMPLE_FILENAME = 'example.vue'

export function compileTemplateForEval(compiledComponent: EvaluableComponent):void {
	if (compiledComponent.template) {
		const { bindings } = compileScript(
			{
				cssVars: [],
				script: {
					type: 'script',
					content: `export default (function () {${compiledComponent.script}})()`
				},
				scriptSetup: null
			} as any,
			{
				id: '-'
			}
		)
		const renderObject = compileTemplate({
			source: compiledComponent.template,
			filename: EXAMPLE_FILENAME,
			id: '-',
			compilerOptions: {
				bindingMetadata: bindings,
				prefixIdentifiers: true,
				mode: 'function'

			}
		})
		setFinalRender(compiledComponent, renderObject)
	}
}

export function compileTemplateForEvalSetup(compiledComponent: EvaluableComponent, code:string):void{
	const descriptor = parseComponent(code)
	const { bindings } = compileScript(descriptor as any, { id: '-' })
	const renderObject = compileTemplate({
		source: code,
		filename: EXAMPLE_FILENAME,
		id: '-',
		compilerOptions: {
			bindingMetadata: bindings,
			prefixIdentifiers: true,
			mode: 'function'
		},
	})
	setFinalRender(compiledComponent, renderObject)
}

function setFinalRender(sfc: EvaluableComponent, renderObject:any):void {
	sfc.script = `
${isVue3 ? 'const Vue = require("vue")' : ''}
const comp = (function() {${sfc.script}})()${
  renderObject.staticRenderFns?.length ? `
comp.staticRenderFns = [${renderObject.staticRenderFns
?.map((fn:string) => {
  return `function(){${fn}}`
})
.join(',')}]` : ''}
comp.render = function() {${renderObject.code}}
${
	isVue3
		? `comp.render = comp.render()`:''
}
return comp`
		delete sfc.template
}
