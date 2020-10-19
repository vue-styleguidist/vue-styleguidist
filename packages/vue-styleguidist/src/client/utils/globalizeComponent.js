import { cleanName } from 'vue-inbrowser-compiler-utils'
import { globalComponents } from './vueApp'

const isEs6Export = module => !!module.default

/**
 * Expose component as global variables.
 *
 * @param {Object} component
 */
export default function globalizeComponent(component) {
	const displayName = component.props.displayName || ''
	if (!component.name) {
		return
	}

	const configComponent = isEs6Export(component.module)
		? component.module.default
		: component.module

	if (configComponent) {
		globalComponents.push({ key: cleanName(displayName), comp: configComponent })
	}

	if (component.subComponents) {
		component.subComponents.forEach(c => globalizeComponent(c))
	}
}
