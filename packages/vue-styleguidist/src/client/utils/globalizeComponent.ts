import { Component as VueConstructor } from 'vue'
import { cleanName, isVue3, Vue2 } from 'vue-inbrowser-compiler-utils'
import { Component } from '../../types/Component'
import { addGlobalComponentToRegistration } from './globalComponents'

const isEs6Export = (module: any): module is { default: VueConstructor } => !!module.default

/**
 * Expose component as global variables.
 *
 * @param {Object} component
 */
export default function globalizeComponent(component: Component) {
	const displayName = component.props.displayName || ''
	if (!component.name) {
		return
	}

	const configComponent = isEs6Export(component.module)
		? component.module.default
		: component.module

	if (configComponent) {
		if (isVue3) {
			addGlobalComponentToRegistration(cleanName(displayName), configComponent)
		} else {
			// @ts-ignore this is to keep vue 2 compatibility
			Vue2.component(cleanName(displayName), configComponent)
		}
	}

	if (component.subComponents) {
		component.subComponents.forEach(c => globalizeComponent(c))
	}
}
