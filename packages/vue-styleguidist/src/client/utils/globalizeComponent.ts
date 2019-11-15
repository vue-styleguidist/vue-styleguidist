import Vue from 'vue'
import { Component } from 'types/Component'
import cleanComponentName from './cleanComponentName'

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
		Vue.component(cleanComponentName(displayName || ''), configComponent)
	}
}
