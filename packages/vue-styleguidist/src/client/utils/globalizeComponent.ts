import Vue, { VueConstructor } from 'vue'
import cleanName from 'vue-docgen-api/dist/utils/cleanName'
import { Component } from '../../types/Component'

const isEs6Export = (module: any): module is { default: VueConstructor } => !!module.default

/**
 * Expose component as global variables.
 *
 * @param {Object} component
 */
export default function globalizeComponent(component: Component) {
	const displayName = component.props.displayName
	if (!component.name) {
		return
	}
	const configComponent = isEs6Export(component.module)
		? component.module.default
		: component.module
	if (configComponent) {
		Vue.component(cleanName(displayName || ''), configComponent)
	}
}
