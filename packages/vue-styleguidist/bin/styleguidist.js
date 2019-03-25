#!/usr/bin/env node
/* eslint-disable no-console */

const minimist = require('minimist')
const kleur = require('kleur')
const StyleguidistError = require('react-styleguidist/lib/scripts/utils/error')

const getConfig = require('../scripts/config')
const consts = require('../scripts/consts')
const binutils = require('../scripts/binutils')
const logger = require('glogg')('vsg-bin')

const argv = minimist(process.argv.slice(2))
const command = argv._[0]

// Do not show nasty stack traces for Styleguidist errors
process.on('uncaughtException', err => {
	if (err.code === 'EADDRINUSE') {
		binutils.printErrorWithLink(
			`Another server is running at port ${
				config.serverPort
			} already. Please stop it or change the default port to continue.`,
			'You can change the port using the `serverPort` option in your style guide config:',
			consts.DOCS_CONFIG
		)
	} else if (err instanceof StyleguidistError) {
		console.error(kleur.bold.red(err.message))
		logger.debug(err.stack)
	} else {
		console.error(err.toString())
		console.error(err.stack)
	}
	process.exit(1)
})

// Make sure user has webpack installed
require('../scripts/utils/ensureWebpack')

// Set environment before loading style guide config because user’s webpack config may use it
const env = command === 'build' ? 'production' : 'development'
process.env.NODE_ENV = process.env.NODE_ENV || env

// Load style guide config
let config
try {
	config = getConfig(argv.config, binutils.updateConfig)
} catch (err) {
	if (err instanceof StyleguidistError) {
		const link = consts.DOCS_CONFIG + (err.anchor ? `#${err.anchor.toLowerCase()}` : '')
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

process.env.VUESG_VERBOSE = !!argv.verbose

binutils.verbose('Styleguidist config:', config)

switch (command) {
	case 'build':
		binutils.commandBuild(config)
		break
	case 'server':
		binutils.commandServer(config, argv.open)
		break
	default:
		binutils.commandHelp()
}
