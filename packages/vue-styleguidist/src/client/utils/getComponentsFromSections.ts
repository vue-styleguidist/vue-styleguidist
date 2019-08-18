import { Component } from 'types/Component'
import { ProcessedSection } from 'types/Section'

/**
 * Get all components in all sections
 *
 * @param {array} sections
 */

export default function getComponentsFromSections(sections: ProcessedSection[]): Component[] {
	return sections.reduce((allComponent: Component[], section: ProcessedSection) => {
		let sectionComponents: Component[] = []
		let subSectionComponents: Component[] = []
		if (section.components) {
			sectionComponents = section.components
		}
		if (section.sections) {
			subSectionComponents = getComponentsFromSections(section.sections)
		}
		return [...allComponent, ...sectionComponents, ...subSectionComponents]
	}, [])
}
