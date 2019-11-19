import * as fs from 'fs'
import * as path from 'path'
import findup from 'findup'
import isString from 'lodash/isString'
import isPlainObject from 'lodash/isPlainObject'
import StyleguidistError from 'react-styleguidist/lib/scripts/utils/error'
import sanitizeConfig from 'react-styleguidist/lib/scripts/utils/sanitizeConfig'
import schema from './schemas/config'
import { StyleguidistConfig } from '../types/StyleGuide'

const CONFIG_FILENAME = 'styleguide.config.js'

/**
 * Read, parse and validate config file or passed config.
 *
 * @param {object|string} [config] All config options or config file name or nothing.
 * @param {function} [update] Change config object before running validation on it.
 * @returns {object}
 */
export default function getConfig(
	configParam: string | StyleguidistConfig | { serverPort?: string | number },
	update?: (conf: StyleguidistConfig | {}) => StyleguidistConfig
): StyleguidistConfig {
	let configFilepath
	let config: StyleguidistConfig | { serverPort?: string | number }
	if (isString(configParam)) {
		// Load config from a given file
		configFilepath = path.resolve(process.cwd(), configParam)
		if (!fs.existsSync(configFilepath)) {
			throw new StyleguidistError('Styleguidist config not found: ' + configFilepath + '.')
		}
		config = {}
	} else if (!isPlainObject(configParam)) {
		// Try to read config options from a file
		configFilepath = findConfigFile()
		config = {}
	} else {
		config = configParam
	}

	if (typeof configFilepath === 'string') {
		config = require(configFilepath)
	}

	if (update) {
		config = update(config)
	}

	const configDir =
		typeof configFilepath === 'string' ? path.dirname(configFilepath) : process.cwd()

	if (config.serverPort && isString(config.serverPort)) {
		config.serverPort = parseInt(config.serverPort)
	}

	try {
		return sanitizeConfig(config as StyleguidistConfig, schema, configDir)
	} catch (exception) {
		/* eslint-disable */
		console.log(exception instanceof StyleguidistError, exception.constructor.name)
		throw exception.message
	}
}

/**
 * Try to find config file up the file tree.
 *
 * @return {string|boolean} Config absolute file path.
 */
function findConfigFile() {
	let configDir
	try {
		configDir = findup.sync(process.cwd(), CONFIG_FILENAME)
	} catch (exception) {
		return false
	}

	return path.join(configDir, CONFIG_FILENAME)
}
