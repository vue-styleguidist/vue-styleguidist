import * as path from 'path'
import type { ComponentDoc, ParamTag } from 'vue-docgen-api'
import events from './templates/events'
import methods from './templates/methods'
import expose from './templates/expose'
import slots from './templates/slots'
import props from './templates/props'
import component from './templates/component'
import defaultExample from './templates/defaultExample'
import functionalTag from './templates/functionalTag'
import { FileEventType, SafeDocgenCLIConfig } from './config'
import getDocsBlocks, { getExamplesFilePaths } from './getDocsBlocks'

export { renderTags } from './templates/tags'
export { mdclean } from './templates/utils'
export { events, methods, slots, props, component, expose, defaultExample, functionalTag }
export { default as docgen } from './docgen'

export interface ContentAndDependencies {
	content: string
	dependencies: string[]
	docs: ComponentDoc[]
}

export interface SubTemplateOptions {
	isSubComponent?: boolean
	hasSubComponents?: boolean
}

export function getDependencies(
	doc: Pick<ComponentDoc, 'tags' | 'sourceFiles'>,
	compDirName: string,
	absolutePath: string
): string[] {
	// remove the current file from the list of dependencies
	const externalSourceFiles = doc.sourceFiles?.splice(doc.sourceFiles.indexOf(absolutePath)) || []
	if (!doc.tags) {
		return externalSourceFiles
	}
	const requireDep =
		doc.tags.requires?.map((t: ParamTag) => path.join(compDirName, t.description as string)) || []
	const examplesDep = getExamplesFilePaths(doc.tags, compDirName)
	return [...externalSourceFiles, ...requireDep, ...examplesDep]
}

/**
 * Umbrella that calls docgen
 * Calls each template provided by the user
 * And generates a markdown string + the list of dependencies
 * @param absolutePath
 * @param config
 * @param componentRelativePath
 * @param extraMd
 * @returns content will contain the markdown text, dependencies contains
 * an array of path to files that should trigger the update of this file
 */
export default async function compileTemplates(
	event: FileEventType,
	absolutePath: string,
	config: SafeDocgenCLIConfig,
	componentRelativePath: string,
	subComponent = false
): Promise<ContentAndDependencies> {
	const { apiOptions: options, templates, cwd } = config
	try {
		const docs = await config.propsParser(absolutePath, options, event)
		const components = await Promise.all(
			docs.map(async doc => {
				const { props: p, events: e, methods: m, slots: s, expose: exp } = doc
				const isSubComponent = subComponent
				const hasSubComponents = !!doc.tags?.requires
				const subComponentOptions = { isSubComponent, hasSubComponents }

				const renderedUsage = {
					props: p ? templates.props(p, subComponentOptions) : '',
					slots: s ? templates.slots(s, subComponentOptions) : '',
					methods: m ? templates.methods(m, subComponentOptions) : '',
					events: e ? templates.events(e, subComponentOptions) : '',
					expose: exp ? templates.expose(exp, subComponentOptions) : '',
					functionalTag: templates.functionalTag
				}

				if (!subComponent) {
					doc.docsBlocks = await getDocsBlocks(
						absolutePath,
						doc,
						config.getDocFileName,
						cwd,
						config.editLinkLabel,
						config.getRepoEditUrl
					)

					if (!doc.docsBlocks?.length && config.defaultExamples) {
						doc.docsBlocks = [templates.defaultExample(doc)]
					}
				}

				const componentRelativeDirectoryPath = path.dirname(componentRelativePath)
				const componentAbsoluteDirectoryPath = path.dirname(absolutePath)

				const requiresMd = doc.tags?.requires
					? await Promise.all(
							doc.tags.requires.map((requireTag: ParamTag) =>
								compileTemplates(
									event,
									path.join(componentAbsoluteDirectoryPath, requireTag.description as string),
									config,
									path.join(componentRelativeDirectoryPath, requireTag.description as string),
									true
								)
							)
					  )
					: []

				return {
					content: templates.component(
						renderedUsage,
						doc,
						config,
						componentRelativePath,
						requiresMd,
						subComponentOptions
					),
					dependencies: getDependencies(doc, componentRelativeDirectoryPath, absolutePath),
					docs
				}
			})
		)

		return {
			content: components.map(c => c.content).join('\n\n'),
			dependencies: components.map(c => c.dependencies).reduce((acc, curr) => acc.concat(curr), []),
			docs
		}
	} catch (e) {
		const err = e as Error
		throw new Error(`Error parsing file ${absolutePath}:` + err.message)
	}
}
