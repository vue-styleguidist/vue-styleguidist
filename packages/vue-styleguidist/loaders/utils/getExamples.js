const fs = require('fs')
const path = require('path')
const qss = require('qss')
const requireIt = require('react-styleguidist/lib/loaders/utils/requireIt')

const examplesLoader = path.resolve(__dirname, '../examples-loader.js')

/**
 * Get require statement for examples file if it exists, or for default examples if it was defined.
 *
 * @param {string} file
 * @param {string} examplesFile
 * @param {string} displayName
 * @param {string} defaultExample
 * @param {boolean} isComponentDocInVueFile
 * @returns {object|Array}
 */
module.exports = function getExamples(
	file,
	examplesFile,
	displayName,
	defaultExample,
	isComponentDocInVueFile
) {
	const examplesFileToLoad = examplesFile || defaultExample
	if (!examplesFileToLoad) {
		return null
	}

	const relativePath = `./${path.relative(path.dirname(examplesFileToLoad), file)}`

	const query = {
		displayName,
		file: relativePath,
		shouldShowDefaultExample: !examplesFile && !!defaultExample && !isComponentDocInVueFile,
		customLangs: 'vue|js|jsx'
	}

	if (examplesFile && fs.existsSync(examplesFile)) {
		return requireIt(`!!${examplesLoader}?${qss.encode(query)}!${examplesFile}`)
	}

	if (defaultExample && !isComponentDocInVueFile) {
		return requireIt(`!!${examplesLoader}?${qss.encode(query)}!${defaultExample}`)
	}

	return []
}
