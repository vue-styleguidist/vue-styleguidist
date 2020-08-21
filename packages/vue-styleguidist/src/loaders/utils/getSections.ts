// These two functions should be in the same file because of cyclic imports

import * as fs from 'fs'
import * as path from 'path'
import { castArray, flatten } from 'lodash'
import * as Rsg from 'react-styleguidist'
import { parseMulti, ParamTag, ScriptHandlers } from 'vue-docgen-api'
import requireIt from 'react-styleguidist/lib/loaders/utils/requireIt'
import getComponentFiles from 'react-styleguidist/lib/loaders/utils/getComponentFiles'
import slugger from 'react-styleguidist/lib/loaders/utils/slugger'
import { SanitizedStyleguidistConfig } from '../../types/StyleGuide'
import getComponents from './getComponents'

const examplesLoader = path.resolve(__dirname, '../examples-loader.js')

export interface SectionFunctionOptions {
	config: SanitizedStyleguidistConfig
	componentFiles: string[]
	requiredComponents?: Record<string, string[]>
	requiredComponentsList?: string[]
	parentDepth?: number
}

/**
 * Return object for one level of sections.
 *
 * @param {Array} sections
 * @param {object} config
 * @param {number} parentDepth
 * @returns {Array}
 */
export default async function getSections(
	sections: Rsg.ConfigSection[],
	opts: SectionFunctionOptions
): Promise<Rsg.LoaderSection[]> {
	const { config, componentFiles } = opts

	if (!opts.requiredComponents) {
		opts.requiredComponents = await getRequiredComponents(componentFiles, config.jsxInComponents)
		opts.requiredComponentsList = flatten(Object.values(opts.requiredComponents))
	}

	return Promise.all(sections.map(async section => await processSection(section, opts)))
}

/**
 * Returns all the `@required` file path in the analyzed components
 * this way we can ignore them when analyzing the components in the menu
 * and only add them as a subsection for a parent component
 * @param componentFiles all the component file paths to be analyzed
 */
export async function getRequiredComponents(
	componentFiles: string[],
	jsx: boolean
): Promise<Record<string, string[]>> {
	const pathsArrays = await Promise.all(
		componentFiles.map(async componentPath => {
			const compDirName = path.dirname(componentPath)

			try {
				const docs = await parseMulti(componentPath, {
					scriptPreHandlers: [],
					scriptHandlers: [ScriptHandlers.componentHandler],
					jsx
				})
				return docs.reduce(
					(acc: string[], doc) => {
						if (doc.tags && doc.tags.requires) {
							acc = acc.concat(
								doc.tags.requires.map((t: ParamTag) =>
									path.resolve(compDirName, t.description as string)
								)
							)
						}
						return acc
					},
					[componentPath]
				)
			} catch (e) {
				// eat the error (reported in vuedoc-loader)
			}
			return []
		})
	)
	return pathsArrays.reduce((acc: Record<string, string[]>, pa) => {
		const parentComponent = (pa && pa[0]) || 'undefined'
		acc[parentComponent] = (pa && pa.slice(1)) || []
		return acc
	}, {})
}

/**
 * Return an object for a given section with all components and subsections.
 * @param {object} section
 * @param {object} config
 * @param {number} parentDepth
 * @returns {object}
 */
export async function processSection(
	section: Rsg.ConfigSection,
	opts: SectionFunctionOptions
): Promise<Rsg.LoaderSection> {
	const { config, parentDepth } = opts
	const contentRelativePath = section.content

	// Try to load section content file
	let content
	if (contentRelativePath) {
		const contentAbsolutePath = path.resolve(config.configDir, contentRelativePath)
		if (!fs.existsSync(contentAbsolutePath)) {
			throw new Error(`Styleguidist: Section content file not found: ${contentAbsolutePath}`)
		}
		content = requireIt(`!!${examplesLoader}?customLangs=vue|js|jsx!${contentAbsolutePath}`)
	}

	let sectionDepth

	if (parentDepth === undefined) {
		sectionDepth = section.sectionDepth !== undefined ? section.sectionDepth : 0
	} else {
		sectionDepth = parentDepth === 0 ? 0 : parentDepth - 1
	}

	return {
		name: section.name || '',
		exampleMode: section.exampleMode || config.exampleMode,
		usageMode: section.usageMode || config.usageMode,
		sectionDepth,
		description: section.description,
		slug: slugger.slug(section.name || ''),
		sections: await getSections(section.sections || [], { ...opts, parentDepth: sectionDepth }),
		href: section.href,
		components: getSectionComponents(section, opts),
		content,
		external: section.external
	}
}

const getSectionComponents = (
	section: Rsg.ConfigSection,
	opts: SectionFunctionOptions
): Rsg.LoaderComponent[] => {
	const { config, requiredComponentsList, requiredComponents } = opts
	let ignore = config.ignore ? castArray(config.ignore) : []

	if (section.ignore) {
		ignore = ignore.concat(castArray(section.ignore))
	}

	if (requiredComponentsList) {
		ignore = ignore.concat(requiredComponentsList)
	}

	return getComponents(
		getComponentFiles(section.components, config.configDir, ignore),
		config,
		requiredComponents
	)
}
