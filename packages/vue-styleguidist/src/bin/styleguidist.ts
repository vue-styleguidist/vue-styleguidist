/* eslint-disable no-console */

import minimist from 'minimist'
import kleur from 'kleur'
import createLogger from 'glogg'
import StyleguidistError from 'react-styleguidist/lib/scripts/utils/error'
import { version as vueVersion } from 'vue/package.json'
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

let correctVueVersion = false
if (vueVersion) {
	const [majorVue] = vueVersion.split('.')
	correctVueVersion = parseInt(majorVue, 10) === 2
}

if (!correctVueVersion) {
	throw new Error(
		'This version of vue-styleguidist is only compatible with Vue 2.\n' +
			'We are actively working on an updated version\n' +
			'Join us on Github if you want to lend a hand.\n' +
			'https://github.com/vue-styleguidist/vue-styleguidist/'
	)
	// + " Please install vue-styleguidist next with the following command\n"
	// + " npm iinstall --save-dev vue-styleguidist@next")
}

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
