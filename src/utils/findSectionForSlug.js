/**
 * Recursively finds a slug from section with a given name (exact match)
 *
 * @param  {object}  section
 * @param  {string} slug
 * @return {object}
 */
export default function findSectionForSlug(section, slug) {
	const foundInSections = section.sections.find(
		// Need to replace whitespace in order to get a match in all browsers
		section => section.slug.replace(/\s/g, '%20') === slug.replace(/\s/g, '%20')
	);

	if (foundInSections) {
		return foundInSections;
	}
	const foundInComponent = section.components.find(component => component.slug === slug);

	if (foundInComponent) {
		return {
			components: [foundInComponent],
		};
	}

	return undefined;
}
