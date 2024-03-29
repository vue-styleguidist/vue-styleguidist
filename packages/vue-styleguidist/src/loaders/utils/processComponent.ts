import * as fs from 'fs'
import * as path from 'path'
import * as Rsg from 'react-styleguidist'
import getNameFromFilePath from 'react-styleguidist/lib/loaders/utils/getNameFromFilePath'
import requireIt from 'react-styleguidist/lib/loaders/utils/requireIt'
import slugger from 'react-styleguidist/lib/loaders/utils/slugger'
import { SanitizedStyleguidistConfig } from '../../types/StyleGuide'
import parseVue from './parseVue'

const vueDocLoader = path.resolve(__dirname, '../vuedoc-loader.js')

/**
 * References the filepath of the metadata file.
 *
 * @param {string} filepath
 * @returns {object}
 */
function getComponentMetadataPath(filepath: string): string {
	const ext = path.extname(filepath)
	return filepath.substring(0, filepath.length - ext.length) + '.json'
}

/**
 * Return an object with all required for style guide information for a given component.
 *
 * @param {string} filepath
 * @param {object} config
 * @returns {object}
 */
export default function processComponent(
	filepath: string,
	config: SanitizedStyleguidistConfig,
	subComponentPaths?: string[],
	ignoreExample?: boolean
): Rsg.LoaderComponent & { subComponents?: Rsg.LoaderComponent[] } {
	const componentPath = path.relative(config.configDir || '', filepath)
	const componentName = getNameFromFilePath(filepath)
	const props = requireIt(`!!${vueDocLoader}${ignoreExample ? '?noExample=1' : ''}!${filepath}`)
	const examplesFile = config.getExampleFilename(filepath)
	const componentMetadataPath = getComponentMetadataPath(filepath)
	const hasExamplesFile = examplesFile && fs.existsSync(examplesFile)
	let hasInternalExamples = false
	if (!hasExamplesFile && fs.existsSync(filepath)) {
		const { customBlocks } = parseVue(fs.readFileSync(filepath, 'utf8'))
		hasInternalExamples = customBlocks?.findIndex(p => p.type === 'docs') >= 0
	}
	const hasExamples = hasExamplesFile || hasInternalExamples
	const subComponents: Rsg.LoaderComponent[] | undefined =
		subComponentPaths && subComponentPaths.length
			? subComponentPaths.map(subFilePath => processComponent(subFilePath, config, undefined, true))
			: undefined

	return {
		filepath: componentPath,
		slug: slugger.slug(componentName),
		pathLine: config.getComponentPathLine(componentPath),
		module: requireIt(filepath),
		props,
		hasExamples,
		metadata: fs.existsSync(componentMetadataPath) ? requireIt(componentMetadataPath) : {},
		subComponents
	}
}
