const fs = require('fs')
const path = require('path')
const getNameFromFilePath = require('react-styleguidist/loaders/utils/getNameFromFilePath')
const requireIt = require('react-styleguidist/loaders/utils/requireIt')
const slugger = require('react-styleguidist/loaders/utils/slugger')

const vueDocLoader = path.resolve(__dirname, '../vuedoc-loader.js')

/**
 * References the filepath of the metadata file.
 *
 * @param {string} filepath
 * @returns {object}
 */
function getComponentMetadataPath(filepath) {
	const extname = path.extname(filepath)
	return filepath.substring(0, filepath.length - extname.length) + '.json'
}

/**
 * Return an object with all required for style guide information for a given component.
 *
 * @param {string} filepath
 * @param {object} config
 * @returns {object}
 */
module.exports = function processComponent(filepath, config) {
	const componentPath = path.relative(config.configDir, filepath)
	const componentName = getNameFromFilePath(filepath)
	const props = requireIt(`!!${vueDocLoader}!${filepath}`)
	const examplesFile = config.getExampleFilename(filepath)
	const componentMetadataPath = getComponentMetadataPath(filepath)
	return {
		filepath: componentPath,
		slug: slugger.slug(componentName),
		pathLine: config.getComponentPathLine(componentPath),
		module: requireIt(filepath),
		props,
		hasExamples: examplesFile && fs.existsSync(examplesFile),
		metadata: fs.existsSync(componentMetadataPath) ? requireIt(componentMetadataPath) : {}
	}
}
