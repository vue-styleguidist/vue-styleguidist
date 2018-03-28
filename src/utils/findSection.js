/**
 * Recursively finds a section with a given name (exact match)
 *
 * @param  {Array}  sections
 * @param  {string} name
 * @return {object}
 */
export default function findSection(sections, name) {
	const found = sections.find(
		// Need to replace whitespace in order to get a match in all browsers
		section => section.name.replace(/\s/g, '%20') === name.replace(/\s/g, '%20')
	);
	if (found) {
		return found;
	}

	for (const section of sections) {
		if (!section.sections || section.sections.length === 0) {
			continue;
		}
		const found = findSection(section.sections, name);
		if (found) {
			return found;
		}
	}

	return undefined;
}
