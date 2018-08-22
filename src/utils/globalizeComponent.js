import Vue from 'vue';

/**
 * Expose component as global variables.
 *
 * @param {Object} component
 */
export default function globalizeComponent(component) {
	const displayName = component.props.displayName;
	if (!component.name) {
		return;
	}
	const configComponent = component.module.default || component.module;
	if (configComponent) {
		Vue.component(displayName, configComponent);
	}
}
