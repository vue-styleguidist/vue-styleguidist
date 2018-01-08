import isFinite from 'lodash/isFinite';
import filterComponentExamples from './filterComponentExamples';
import filterComponentsInSectionsByExactName from './filterComponentsInSectionsByExactName';
import filterSectionExamples from './filterSectionExamples';
import filterSectionByLevel from './filterSectionByLevel';
import findSection from './findSection';
import getInfoFromHash from './getInfoFromHash';
import { DisplayModes } from '../consts';
import getUrl from './getUrl';

/**
 * Return sections / components / examples to show on a screen according to a current route.
 *
 * Default: show all sections and components.
 * #!/Button: show only Button section or Button component
 * #!/Button/1: show only the second example (index 1) of Button component
 *
 * @param {object} sections
 * @param {string} hash
 * @param {boolean} navigation
 * @returns {object}
 */
export default function getRouteData(sections, hash, navigation) {
	// Parse URL hash to check if the components list must be filtered
	const {
		// Name of the filtered component/section to show isolated (/#!/Button → Button)
		targetName,
		// Index of the fenced block example of the filtered component isolate (/#!/Button/1 → 1)
		targetIndex,
	} = getInfoFromHash(hash);

	let displayMode = DisplayModes.all;

	if (navigation && !targetName && sections[0]) {
		const name = sections[0].name;
		window.location.href = getUrl({ name, isolated: true });
	}

	// Filter the requested component if required
	if (targetName) {
		const filteredComponents = filterComponentsInSectionsByExactName(sections, targetName);
		if (filteredComponents.length) {
			sections = [{ components: filteredComponents }];
			displayMode = DisplayModes.component;
		} else {
			let section;
			if (navigation) {
				section = filterSectionByLevel(findSection(sections, targetName));
			} else {
				section = findSection(sections, targetName);
			}
			sections = section ? [section] : [];
			displayMode = DisplayModes.section;
		}

		// If a single component or section is filtered and a fenced block index is specified hide all other examples
		if (isFinite(targetIndex)) {
			if (filteredComponents.length === 1) {
				sections = [{ components: [filterComponentExamples(filteredComponents[0], targetIndex)] }];
				displayMode = DisplayModes.example;
			} else if (sections.length === 1) {
				sections = [filterSectionExamples(sections[0], targetIndex)];
				displayMode = DisplayModes.example;
			}
		}
	}

	return { sections, displayMode };
}
