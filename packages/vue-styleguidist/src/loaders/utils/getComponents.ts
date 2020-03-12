import * as Rsg from 'react-styleguidist'
import { SanitizedStyleguidistConfig } from '../../types/StyleGuide'
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
	config: SanitizedStyleguidistConfig
): Rsg.LoaderComponent[] {
	return components.map(filepath => processComponent(filepath, config))
}
