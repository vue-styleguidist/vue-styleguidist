import { compileScript, compileTemplate, isVue3, parseComponent } from 'vue-inbrowser-compiler-demi'
import { EvaluableComponent } from 'vue-inbrowser-compiler-independent-utils'

const EXAMPLE_FILENAME = 'example.vue'

export function compileTemplateForEval(compiledComponent: EvaluableComponent): void {
	if (compiledComponent.template) {
		const { bindings } = compileScript(
			{
				cssVars: [],
				script: {
					type: 'script',
					content: `export default (function () {${compiledComponent.script}})()`,
					loc: {
						start: {
							offset: 0
						}
					}
				},
				source: `<script>export default (function () {${compiledComponent.script}})()</script>`,
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
      scoped: !!compiledComponent.scopeId,
			compilerOptions: {
				bindingMetadata: bindings,
				prefixIdentifiers: true,
				mode: 'function',
        scopeId: compiledComponent.scopeId
			}
		})
		setFinalRender(compiledComponent, renderObject)
	}
}

export function compileTemplateForEvalSetup(
	compiledComponent: EvaluableComponent,
	code: string
): void {
	const descriptor = parseComponent(code)
	const { bindings } = compileScript(descriptor as any, { id: '-' })
	if (compiledComponent.template) {
		const renderObject = compileTemplate({
			source: compiledComponent.template,
			filename: EXAMPLE_FILENAME,
			id: '-',
			compilerOptions: {
				bindingMetadata: bindings,
				prefixIdentifiers: true,
				mode: 'function',
        scopeId: compiledComponent.scopeId
			}
		})
		setFinalRender(compiledComponent, renderObject)
	}
}

function setFinalRender(sfc: EvaluableComponent, renderObject: any): void {
	sfc.script = `
${isVue3 ? 'const Vue = require("vue");const {pushScopeId: _pushScopeId, popScopeId: _popScopeId} = Vue' : ''}
const __sfc__ = (function() {${sfc.script}})()${
		renderObject.staticRenderFns?.length
			? `
      __sfc__.staticRenderFns = [${renderObject.staticRenderFns
					?.map((fn: string) => {
						return `function(){${fn}}`
					})
					.join(',')}]`
			: ''
	}
  __sfc__.render = function() {${renderObject.code}}
${isVue3 ? `
${sfc.scopeId ? `_pushScopeId("${sfc.scopeId}")` : ''}
__sfc__.render = __sfc__.render()
${sfc.scopeId ? `_popScopeId()`: ''}` : ''}
return __sfc__`
	delete sfc.template
}
