export default function filterSectionByLevel(section) {
	if (!section) {
		return section;
	}
	const sections = [];
	const components = [];
	return {
		...section,
		sections,
		components,
	};
}
