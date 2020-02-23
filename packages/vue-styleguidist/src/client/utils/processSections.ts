import { ProcessedSection } from '../../types/Section'
import processComponents from './processComponents'
import compileExamples from './compileExamples'

interface SectionAndFiles {
	exampleFileNames: string[]
	sections: ProcessedSection[]
}

/**
 * Recursively process each component in all sections.
 *
 * @param {Array} sections
 * @return {Array}
 */
export default function processSections({
	sections,
	exampleFileNames
}: SectionAndFiles): ProcessedSection[] {
	return sections.map(section => {
		compileExamples(section.content)
		const { components = [], sections } = section

		return {
			...section,
			visibleName: section.name,
			components: processComponents({ components, exampleFileNames }),
			sections: processSections({ sections, exampleFileNames })
		}
	})
}
