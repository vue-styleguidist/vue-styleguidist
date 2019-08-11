#!/usr/bin/env node

import extractConfig, { DocgenCLIConfig } from './extractConfig'
import docgen from './docgen'

/**
 * run the `config` recursively on pages
 * @param config
 */
function run(config: DocgenCLIConfig) {
	const { pages } = config
	if (pages) {
		// to avoid re-rendering the same pages
		delete config.pages
		pages.forEach(page => {
			const pageConf = { ...config, ...page }
			run(pageConf)
		})
	} else {
		docgen(config)
	}
}

const conf = extractConfig(process.argv, process.cwd())
run(conf)
