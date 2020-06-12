#!/usr/bin/env node

import minimist from 'minimist'
import extractConfig from './extractConfig'
import docgen from './docgen'
import { SafeDocgenCLIConfig } from './config'

/**
 * run the `config` recursively on pages
 * @param config
 */
function run(config: SafeDocgenCLIConfig) {
	const { pages } = config
	if (pages) {
		// to avoid re-rendering the same pages
		delete config.pages
		pages.forEach((page) => {
			const pageConf = { ...config, ...page }
			run(pageConf)
		})
	} else {
		docgen(config)
	}
}

const { _: pathArray, configFile, watch, cwd } = minimist(process.argv.slice(2), {
	alias: { c: 'configFile', w: 'watch' }
})

const conf = extractConfig(cwd || process.cwd(), watch, configFile, pathArray)
run(conf)
