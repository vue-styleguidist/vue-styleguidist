import { ComponentDoc, getDefaultExample, cleanName } from 'vue-docgen-api'

const COMPONENT_PLACEHOLDER = '__COMPONENT__'
const COMPONENT_PLACEHOLDER_C = `<${COMPONENT_PLACEHOLDER} />`
const COMPONENT_PLACEHOLDER_REGEXP = new RegExp(COMPONENT_PLACEHOLDER, 'g')

/**
 * Wrap a string with require() statement.
 *
 * @param {string} source Source code.
 * @param {string} componentName Name that will be used instead of a placeholder.
 * @returns {string}
 */
export default function expandDefaultComponent(source: string, docs: ComponentDoc): string {
	return source
		.replace(COMPONENT_PLACEHOLDER_C, getDefaultExample(docs))
		.replace(COMPONENT_PLACEHOLDER_REGEXP, cleanName(docs.displayName))
}
