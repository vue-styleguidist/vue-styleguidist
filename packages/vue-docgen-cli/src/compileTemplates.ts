import * as path from 'path'
import { parse, ComponentDoc, ParamTag } from 'vue-docgen-api'
import events from './templates/events'
import methods from './templates/methods'
import slots from './templates/slots'
import props from './templates/props'
import component from './templates/component'
import defaultExample from './templates/defaultExample'
import functionalTag from './templates/functionalTag'
import { SafeDocgenCLIConfig } from './config'
import getDocsBlocks, { getExamplesFilePaths } from './getDocsBlocks'

export { mdclean } from './templates/utils'
export { events, methods, slots, props, component, defaultExample, functionalTag }
export { default as docgen } from './docgen'

export interface ContentAndDependencies {
	content: string
	dependencies: string[]
}

export function getDependencies(doc: Pick<ComponentDoc, 'tags'>, compDirName: string): string[] {
	if (!doc.tags) return []
	const requireDep = doc.tags.requires?.map((t: ParamTag) => path.join(compDirName, t.description as string)) || []
	const examplesDep = getExamplesFilePaths(doc.tags, compDirName)
	return [...requireDep, ...examplesDep]
}

/**
 *
 * @param absolutePath
 * @param config
 * @param componentRelativePath
 * @param extraMd
 */
export default async function compiletemplates(
	absolutePath: string,
	config: SafeDocgenCLIConfig,
	componentRelativePath: string,
	extraMd?: string,
	subComponent = false
): Promise<ContentAndDependencies> {
	const { apiOptions: options, templates } = config
	try {
		const doc = await parse(absolutePath, options)
		const { props, events, methods, slots } = doc

		const renderedUsage = {
			props: props ? templates.props(props, subComponent) : '',
			slots: slots ? templates.slots(slots, subComponent) : '',
			methods: methods ? templates.methods(methods, subComponent) : '',
			events: events ? templates.events(events, subComponent) : '',
			functionalTag: templates.functionalTag
		}

		if (!subComponent) {
			if (extraMd?.length || doc.tags?.example || doc.tags?.examples) {
				doc.docsBlocks = await getDocsBlocks(absolutePath, doc, extraMd)
			}

			if (!doc.docsBlocks?.length && config.defaultExamples) {
				doc.docsBlocks = [templates.defaultExample(doc)]
			}
		}

		const componentRelativeDirectoryPath = path.dirname(componentRelativePath)
		const componentAbsoluteDirectoryPath = path.dirname(absolutePath)

		const requiresMd =
			!subComponent && doc.tags?.requires
				? await Promise.all(
						doc.tags.requires.map((requireTag: ParamTag) =>
							compiletemplates(
								path.join(componentAbsoluteDirectoryPath, requireTag.description as string),
								config,
								path.join(componentRelativeDirectoryPath, requireTag.description as string),
								'',
								true
							)
						)
				  )
				: []

		return {
			content: templates.component(renderedUsage, doc, config, componentRelativePath, requiresMd),
			dependencies: getDependencies(doc, componentRelativeDirectoryPath)
		}
	} catch (e) {
		throw new Error(`Error parsing file ${absolutePath}:` + e.message)
	}
}
