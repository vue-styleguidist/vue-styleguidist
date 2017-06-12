'use strict';

const fs = require('fs');
const path = require('path');
const requireIt = require('./requireIt');

const vueDocLoader = path.resolve(__dirname, '../vuedoc-loader.js');

/* eslint-disable no-console */
/**
 * References the filepath of the metadata file.
 *
 * @param {string} filepath
 * @returns {object}
 */
function getComponentMetadataPath(filepath) {
	const extname = path.extname(filepath);
	return filepath.substring(0, filepath.length - extname.length) + '.json';
}

/**
 * Is a vue file
 *
 * @param {string} filepath
 * @returns {boolean}
 */
function isVueFile(filepath) {
	return /.vue$/.test(filepath);
}

/**
 * Return an object with all required for style guide information for a given component.
 *
 * @param {string} filepath
 * @param {object} config
 * @returns {object}
 */
module.exports = function processComponent(filepath, config) {
	let props;
	const componentPath = path.relative(config.configDir, filepath);
	if (isVueFile(filepath)) {
		props = requireIt(`!!${vueDocLoader}!${filepath}`);
	} else {
		const message =
			`Error when parsing ${filepath}:\n\n` +
			'Only can parse files .vue:\n' +
			console.log(`\n${message}\n`);
		throw new Error(message);
	}
	const examplesFile = config.getExampleFilename(filepath);
	const componentMetadataPath = getComponentMetadataPath(filepath);
	return {
		filepath: componentPath,
		pathLine: config.getComponentPathLine(componentPath),
		module: requireIt(filepath),
		props,
		hasExamples: examplesFile && fs.existsSync(examplesFile),
		metadata: fs.existsSync(componentMetadataPath)
			? requireIt(`!!json-loader!${componentMetadataPath}`)
			: {},
	};
};
