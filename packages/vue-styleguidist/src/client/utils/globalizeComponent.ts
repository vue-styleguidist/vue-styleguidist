import Vue from 'vue'
import cleanName from 'vue-docgen-api/dist/utils/cleanName'
import { Component } from '../../types/Component'

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
	const configComponent = component.module.default || component.module
	if (configComponent) {
		Vue.component(cleanName(displayName || ''), configComponent)
	}
}
