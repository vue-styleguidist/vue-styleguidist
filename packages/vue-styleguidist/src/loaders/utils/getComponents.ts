import { ProcessedStyleGuidistConfigObject } from '../../types/StyleGuide'
import { Component } from '../../types/Component'
import processComponent from './processComponent'

/**
 * Process each component in a list.
 *
 * @param {Array} components File names of components.
 * @param {object} config
 * @returns {object|null}
 */
export default function getComponents(
	components: string[],
	config: ProcessedStyleGuidistConfigObject
): Component[] {
	return components.map(filepath => processComponent(filepath, config))
}
