import * as path from 'path'
import type { ComponentDoc, ParamTag } from 'vue-docgen-api'
import * as log from 'loglevel'
import events from './templates/events'
import methods from './templates/methods'
import expose from './templates/expose'
import slots from './templates/slots'
import props from './templates/props'
import component from './templates/component'
import header from './templates/header'
import defaultExample from './templates/defaultExample'
import functionalTag from './templates/functionalTag'
import { FileEventType, SafeDocgenCLIConfig } from './config'
import getDocsBlocks, { getExamplesFilePaths } from './getDocsBlocks'
import { resolveRequiresFromTag } from './utils'

export { renderTags } from './templates/tags'
export { mdclean } from './templates/utils'
export { events, methods, slots, props, component, header, expose, defaultExample, functionalTag }
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
	const requireDep = resolveRequiresFromTag(doc.tags.requires, compDirName)
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
					props: p ? await Promise.resolve(templates.props(p, subComponentOptions, doc)) : '',
					slots: s ? await Promise.resolve(templates.slots(s, subComponentOptions, doc)) : '',
					methods: m ? await Promise.resolve(templates.methods(m, subComponentOptions, doc)) : '',
					events: e ? await Promise.resolve(templates.events(e, subComponentOptions, doc)) : '',
					expose: exp ? await Promise.resolve(templates.expose(exp, subComponentOptions, doc)) : '',
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
						doc.docsBlocks = [await Promise.resolve(templates.defaultExample(doc))]
					}
				}

				const componentRelativeDirectoryPath = path.dirname(componentRelativePath)
				const componentAbsoluteDirectoryPath = path.dirname(absolutePath)

				const requiresMd = doc.tags?.requires
					? await Promise.all(
							resolveRequiresFromTag(doc.tags.requires, componentAbsoluteDirectoryPath).map(
								(requirePath: string) =>
									compileTemplates(event, requirePath, config, requirePath, true)
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
			content: (await templates.header(docs)) + '\n' + components.map(c => c.content).join('\n\n'),
			dependencies: components.map(c => c.dependencies).reduce((acc, curr) => acc.concat(curr), []),
			docs
		}
	} catch (e) {
		log.error(`[vue-docgen-cli] Error parsing file ${absolutePath}:`)
		throw e
	}
}
