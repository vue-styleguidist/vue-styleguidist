import getUrl from 'react-styleguidist/lib/client/utils/getUrl'
import { ProcessedSection } from '../../types/Section'
import processComponents, { HrefOptions } from './processComponents'
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
export default function processSections(
	{ sections, exampleFileNames }: SectionAndFiles,
	{ useRouterLinks, useHashId = false, hashPath = [] }: HrefOptions
): ProcessedSection[] {
	return sections.map(section => {
		const options = {
			useRouterLinks: Boolean(useRouterLinks && section.name),
			useHashId: section.sectionDepth === 0,
			hashPath: [...hashPath, section.name ? section.name : '-']
		}
		compileExamples(section.content || [])
		const { components = [], sections: sectionsInside } = section

		const href =
			section.href ||
			getUrl({
				name: section.name,
				slug: section.slug,
				anchor: !useRouterLinks,
				hashPath: useRouterLinks ? hashPath : false,
				useSlugAsIdParam: useRouterLinks ? useHashId : false
			})

		return {
			...section,
			visibleName: section.name,
			href,
			components: processComponents({ components, exampleFileNames }, options),
			sections: processSections({ sections: sectionsInside, exampleFileNames }, options)
		}
	})
}
