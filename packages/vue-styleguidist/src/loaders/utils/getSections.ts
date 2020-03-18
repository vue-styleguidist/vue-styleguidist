// These two functions should be in the same file because of cyclic imports

import * as fs from 'fs'
import * as path from 'path'
import { castArray } from 'lodash'
import * as Rsg from 'react-styleguidist'
import requireIt from 'react-styleguidist/lib/loaders/utils/requireIt'
import getComponentFiles from 'react-styleguidist/lib/loaders/utils/getComponentFiles'
import slugger from 'react-styleguidist/lib/loaders/utils/slugger'
import { SanitizedStyleguidistConfig } from '../../types/StyleGuide'
import getComponents from './getComponents'

const examplesLoader = path.resolve(__dirname, '../examples-loader.js')

/**
 * Return object for one level of sections.
 *
 * @param {Array} sections
 * @param {object} config
 * @param {number} parentDepth
 * @returns {Array}
 */
export default function getSections(
	sections: Rsg.ConfigSection[],
	config: SanitizedStyleguidistConfig,
	parentDepth?: number
): Rsg.LoaderSection[] {
	return sections.map(section => processSection(section, config, parentDepth))
}

/**
 * Return an object for a given section with all components and subsections.
 * @param {object} section
 * @param {object} config
 * @param {number} parentDepth
 * @returns {object}
 */
export function processSection(
	section: Rsg.ConfigSection,
	config: SanitizedStyleguidistConfig,
	parentDepth?: number
): Rsg.LoaderSection {
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
		sections: getSections(section.sections || [], config, sectionDepth),
		href: section.href,
		components: getSectionComponents(section, config),
		content,
		external: section.external
	}
}

const getSectionComponents = (
	section: Rsg.ConfigSection,
	config: SanitizedStyleguidistConfig
): Rsg.LoaderComponent[] => {
	let ignore = config.ignore ? castArray(config.ignore) : []
	if (section.ignore) {
		ignore = ignore.concat(castArray(section.ignore))
	}

	return getComponents(getComponentFiles(section.components, config.configDir, ignore), config)
}
