import {
	cleanName,
	compileTemplateForEval,
	EvaluableComponent,
	h,
	isVue3
} from 'vue-inbrowser-compiler-utils'
import { getVueAppFactory } from './getVueApp'

const getVueApp = getVueAppFactory()

interface InjectedParams {
	compiledExample: EvaluableComponent
	evalInContext: (code: string) => () => any
	vuex: any
	component: any
	renderRootJsx: any
	enhancePreviewApp: (app: any) => void
	handleError: (e: any) => void
	destroyVueInstance: () => void
	el: HTMLElement
	locallyRegisterComponents: boolean
	moduleId: string
}

export function getCompiledExampleComponent({
	compiledExample,
	evalInContext,
	vuex,
	component,
	renderRootJsx,
	enhancePreviewApp,
	handleError,
	destroyVueInstance,
	el,
	locallyRegisterComponents,
	moduleId
}: InjectedParams) {
	let style
	let previewComponent: any = {}
	const calcOptions = () => {
		try {
			style = compiledExample.style
			if (compiledExample.script) {
				// compile and execute the script
				// it can be:
				// - a script setting up variables => we set up the data function of previewComponent
				// - a `new Vue()` script that will return a full config object
				previewComponent = evalInContext(compiledExample.script)() || {}
				if (previewComponent.render) {
					const originalRender = previewComponent.render
					previewComponent.render = function (...args: any[]) {
						try {
							return originalRender.call(this, ...args)
						} catch (e) {
							handleError(e)
							return undefined
						}
					}
				}
			}
			if (compiledExample.template) {
				// if this is a pure template or if we are in hybrid vsg mode,
				// we need to set the template up.
				previewComponent.template = `<div>${compiledExample.template}</div>`
			}
		} catch (err) {
			handleError(err)
			previewComponent = { template: '<div/>' }
		}
	}
	calcOptions()

	// In case the template is inlined in the script,
	// we need to compile it
	if (previewComponent.template && compiledExample) {
		compiledExample.template = previewComponent.template
		compileTemplateForEval(compiledExample)
		calcOptions()
		delete previewComponent.template
	}

	let extendsComponent = {}
	if (vuex) {
		extendsComponent = { store: vuex.default }
	}

	if (isVue3) {
		previewComponent.__scopeId = 'data-' + moduleId
	} else {
		previewComponent._scopeId = 'data-' + moduleId
	}

	// if we are in local component registration, register current component
	// NOTA: on independent md files, component.module is undefined
	if (
		component.module &&
		locallyRegisterComponents &&
		// NOTA: if the components member of the vue config object is
		// already set it should not be changed
		!previewComponent.components
	) {
		component.displayName = cleanName(component.name)
		// register component locally
		previewComponent.components = {
			[component.displayName]: component.module.default || component.module
		}

		if (component.props.subComponents) {
			component.props.subComponents.forEach((c: any) => {
				c.displayName = cleanName(c.name)
				previewComponent.components[c.displayName] = c.module.default || c.module
			})
		}
	}

	// then we just have to render the setup previewComponent in the prepared slot
	const rootComponent =
		typeof renderRootJsx?.default === 'function'
			? renderRootJsx.default(previewComponent)
			: {
					render: (createElement: (comp: any) => any) =>
						(isVue3 ? h : createElement)(previewComponent)
			  }
	try {
		destroyVueInstance()
		return {
			app: getVueApp(
				{
					...extendsComponent,
					...rootComponent
				},
				el,
				enhancePreviewApp
			),
			style
		}
	} catch (err) {
		handleError(err)
		return {}
	}
}
