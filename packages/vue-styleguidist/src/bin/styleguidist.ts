#!/usr/bin/env node
/* eslint-disable no-console */

import minimist from 'minimist'
import kleur from 'kleur'
import createLogger from 'glogg'
import StyleguidistError from 'react-styleguidist/lib/scripts/utils/error'
import { SanitizedStyleguidistConfig } from '../types/StyleGuide'
import getConfig from '../scripts/config'
import consts from '../scripts/consts'
import * as binutils from '../scripts/binutils'
import isPromise from '../scripts/utils/isPromise'

const logger = createLogger('rsg')

const argv = minimist(process.argv.slice(2))
const command = argv._[0]

// Do not show nasty stack traces for Styleguidist errors
process.on('uncaughtException', (err: any) => {
	if (err.code === 'EADDRINUSE') {
		binutils.printErrorWithLink(
			`Another server is running at port ${config.serverPort} already. Please stop it or change the default port to continue.`,
			'You can change the port using the `serverPort` option in your style guide config:',
			consts.DOCS_CONFIG
		)
	} else if (err instanceof StyleguidistError) {
		console.error(kleur.bold.red(err.message))
		if (err.stack) {
			logger.debug(err.stack)
		}
	} else {
		console.error(err.toString())
		console.error(err.stack)
	}
	process.exit(1)
})

// Make sure user has webpack installed
require('react-styleguidist/lib/scripts/utils/ensureWebpack')

// Set environment before loading style guide config because user’s webpack config may use it
const env = command === 'build' ? 'production' : 'development'
process.env.NODE_ENV = process.env.NODE_ENV || env

// Load style guide config
let config: SanitizedStyleguidistConfig
try {
	if (argv.verbose) {
		process.env.VUESG_VERBOSE = 'true'
	}

	const conf = getConfig(argv.config, binutils.updateConfig)

	if (isPromise(conf)) {
		conf.then(runIt).catch(e => {
			throw e
		})
	} else {
		runIt(conf)
	}
} catch (err) {
	if (err instanceof StyleguidistError) {
		const link = consts.DOCS_CONFIG + (err.extra ? `#${err.extra.toLowerCase()}` : '')
		binutils.printErrorWithLink(
			err.message,
			`${err.extra}\n\nLearn how to configure your style guide:`,
			link
		)
		process.exit(1)
	} else {
		throw err
	}
}

function runIt(conf: SanitizedStyleguidistConfig) {
	config = conf
	binutils.verbose('Styleguidist config:', config)

	switch (command) {
		case 'build':
			binutils.commandBuild({
				...config,
				progressBar: argv.ci !== undefined ? !argv.ci : config.progressBar
			})
			break
		case 'server':
			binutils.commandServer(config, argv.open)
			break
		default:
			binutils.commandHelp()
	}
}
