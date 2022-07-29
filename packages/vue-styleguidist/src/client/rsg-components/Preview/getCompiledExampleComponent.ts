import {
	addScopedStyle,
	cleanName,
	EvaluableComponent,
	h,
	isVue3
} from 'vue-inbrowser-compiler-utils'
import { getVueApp } from './getVueApp'

interface InjectedParams {
	compiledExample: EvaluableComponent
	evalInContext: (code: string) => () => any
	vuex: any
	component: any
	renderRootJsx: any
	handleError: (e: any) => void
	destroyVueInstance: () => void
	el: HTMLElement
	locallyRegisterComponents: boolean
}

export function getCompiledExampleComponent({
	compiledExample,
	evalInContext,
	vuex,
	component,
	renderRootJsx,
	handleError,
	destroyVueInstance,
	el,
	locallyRegisterComponents
}: InjectedParams) {
	let style
	let previewComponent: any = {}
	try {
		style = compiledExample.style
		if (compiledExample.script) {
			// compile and execute the script
			// it can be:
			// - a script setting up variables => we set up the data function of previewComponent
			// - a `new Vue()` script that will return a full config object
			previewComponent = evalInContext(compiledExample.script)() || {}
		}
		if (compiledExample.template) {
			// if this is a pure template or if we are in hybrid vsg mode,
			// we need to set the template up.
			previewComponent.template = `<div>${compiledExample.template}</div>`
		}
	} catch (err) {
		handleError(err)
		previewComponent.template = '<div/>'
	}

	let extendsComponent = {}
	if (vuex) {
		extendsComponent = { store: vuex.default }
	}
	const moduleId = 'v-' + Math.floor(Math.random() * 1000) + 1
	previewComponent._scopeId = 'data-' + moduleId

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
	const rootComponent = renderRootJsx
		? renderRootJsx.default(previewComponent)
		: {
				render: (createElement: (previewComponent: any) => any) =>
					(isVue3 ? h : createElement)(previewComponent)
		  }
	try {
		destroyVueInstance()
		return getVueApp(
			{
				...extendsComponent,
				...rootComponent
			},
			el
		)
	} catch (err) {
		handleError(err)
	}

	// Add the scoped style if there is any
	if (style) {
		addScopedStyle(style, moduleId)
	}
}
