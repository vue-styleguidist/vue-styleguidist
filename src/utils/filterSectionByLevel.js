export default function filterSectionByLevel(section) {
	if (!section) {
		return section;
	}
	const sections = section.level === 0 ? [] : section.sections;
	return {
		...section,
		sections,
	};
}
