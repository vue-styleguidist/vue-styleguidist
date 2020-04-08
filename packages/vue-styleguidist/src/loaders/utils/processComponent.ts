import { parseComponent } from 'vue-template-compiler'
import * as fs from 'fs'
import * as path from 'path'
import * as Rsg from 'react-styleguidist'
import getNameFromFilePath from 'react-styleguidist/lib/loaders/utils/getNameFromFilePath'
import requireIt from 'react-styleguidist/lib/loaders/utils/requireIt'
import slugger from 'react-styleguidist/lib/loaders/utils/slugger'
import { SanitizedStyleguidistConfig } from '../../types/StyleGuide'

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
	propsPlaceholder?: any
): Rsg.LoaderComponent {
	const componentPath = path.relative(config.configDir || '', filepath)
	const componentName = getNameFromFilePath(filepath)
	const props = propsPlaceholder || requireIt(`!!${vueDocLoader}!${filepath}`)
	const examplesFile = config.getExampleFilename(filepath)
	const componentMetadataPath = getComponentMetadataPath(filepath)
	const hasExamplesFile = examplesFile && fs.existsSync(examplesFile)
	let hasInternalExamples = false
	if (!hasExamplesFile && fs.existsSync(filepath)) {
		const customBlocks = parseComponent(fs.readFileSync(filepath, 'utf8')).customBlocks
		hasInternalExamples = !!customBlocks && customBlocks.findIndex(p => p.type === 'docs') >= 0
	}
	const hasExamples = hasExamplesFile || hasInternalExamples

	return {
		filepath: componentPath,
		slug: slugger.slug(componentName),
		pathLine: config.getComponentPathLine(componentPath),
		module: requireIt(filepath),
		props,
		hasExamples,
		metadata: fs.existsSync(componentMetadataPath) ? requireIt(componentMetadataPath) : {}
	}
}
