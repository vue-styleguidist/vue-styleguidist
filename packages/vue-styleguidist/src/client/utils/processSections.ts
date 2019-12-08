import { ProcessedSection } from '../../types/Section'
import processComponents from './processComponents'
import compileExamples from './compileExamples'

/**
 * Recursively process each component in all sections.
 *
 * @param {Array} sections
 * @return {Array}
 */
export default function processSections(sections: ProcessedSection[]): ProcessedSection[] {
	return sections.map(section => {
		compileExamples(section.content)

		return {
			...section,
			visibleName: section.name,
			components: processComponents(section.components || []),
			sections: processSections(section.sections || [])
		}
	})
}
