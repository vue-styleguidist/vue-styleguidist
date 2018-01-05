import processComponents from './processComponents';

/**
 * Recursively process each component in all sections.
 *
 * @param {Array} sections
 * @param {String} vuex
 * @return {Array}
 */
export default function processSections(sections, vuex) {
	return sections.map(section => ({
		...section,
		components: processComponents(section.components || [], vuex),
		sections: processSections(section.sections || [], vuex),
	}));
}
