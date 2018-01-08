import processComponents from './processComponents';

/**
 * Recursively process each component in all sections.
 *
 * @param {Array} sections
 * @param {String} vuex
 * @param {Number} level
 * @param {String} nameParent
 * @return {Array}
 */
export default function processSections(sections, vuex, level = 0, nameParent = '') {
	return sections.map(section => ({
		...section,
		components: processComponents(section.components || [], vuex, level + 1, section.name),
		sections: processSections(section.sections || [], vuex, level + 1, section.name),
		nameParent,
		level,
	}));
}
