/* eslint-disable no-console */

import { stringify } from 'q-i'
import { moveCursor, clearLine } from 'readline'
import WebpackDevServer from 'webpack-dev-server'
import { Stats, Compiler, ProgressPlugin as ProgressPluginNormal, WebpackError } from 'webpack'
import * as kleur from 'kleur'
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import webpackDevServerUtils from 'react-dev-utils/WebpackDevServerUtils'
import openBrowser from 'react-dev-utils/openBrowser'
import setupLogger from 'react-styleguidist/lib/scripts/logger'
import glogg from 'glogg'
import { Bar as ProgressBar, Presets } from 'cli-progress'
import { SanitizedStyleguidistConfig } from '../types/StyleGuide'
import server from './server'
import build from './build'
import consts from './consts'

const logger = glogg('rsg')

export type ServerInfo = { app: WebpackDevServer; compiler: Compiler }

/**
 * @param {object} config
 * @return {object}
 */
export function updateConfig(config: SanitizedStyleguidistConfig) {
	// Set verbose mode from config option or command line switch
	config.verbose = config.verbose || !!process.env.VUESG_VERBOSE

	// Setup logger *before* config validation (because validations may use logger to print warnings)
	setupLogger(config.logger, config.verbose)

	return config
}

const getProgressPlugin = (msg: string) => {
	const bar = new ProgressBar(
		{
			format: `${msg} ${kleur.green('{bar}')} {percentage}%`
		},
		Presets.rect
	)

	const ProgressPlugin: typeof ProgressPluginNormal = process.env.VSG_WEBPACK_PATH
		? // eslint-disable-next-line @typescript-eslint/no-var-requires
		  require(process.env.VSG_WEBPACK_PATH).ProgressPlugin
		: ProgressPluginNormal

	return {
		plugin: new ProgressPlugin(percentage => {
			bar.update(percentage)
		}),
		bar
	}
}

export function commandBuild(config: SanitizedStyleguidistConfig): Compiler {
	let bar: ProgressBar | undefined

	const ProgressPlugin: typeof ProgressPluginNormal = process.env.VSG_WEBPACK_PATH
		? // eslint-disable-next-line @typescript-eslint/no-var-requires
		  require(process.env.VSG_WEBPACK_PATH).ProgressPlugin
		: ProgressPluginNormal

	if (
		config.progressBar !== false &&
		!(config.webpackConfig.plugins || []).some(p => p?.constructor === ProgressPlugin)
	) {
		const { plugin, bar: localBar } = getProgressPlugin('Building style guide')
		bar = localBar
		config.webpackConfig.plugins = [...(config.webpackConfig.plugins || []), plugin]
		bar.start(1, 0)
	}

	const compiler = build(config, (err: Error) => {
		if (err) {
			console.error(err)
			process.exit(1)
		} else if (config.printBuildInstructions) {
			config.printBuildInstructions(config)
		} else {
			printBuildInstructions(config)
		}
	}) as Compiler

	verbose('Webpack config:', compiler.options)

	// Custom error reporting
	compiler.hooks.done.tap('vsrDoneBuilding', function (stats: Stats) {
		const messages = formatWebpackMessages(stats.toJson({}) as any)
		const hasErrors = printAllErrorsAndWarnings(messages, stats.compilation)
		if (bar) {
			bar.stop()
			moveCursor(process.stdout, 0, -1)
			clearLine(process.stdout, 0)
		}
		if (hasErrors) {
			process.exit(1)
		}
	})

	// in order to have the caller be able to interact
	// with the compiler when i's hot
	return compiler
}

export function commandServer(config: SanitizedStyleguidistConfig, open?: boolean): ServerInfo {
	let bar: ProgressBar | undefined

	const ProgressPlugin: typeof ProgressPluginNormal = process.env.VSG_WEBPACK_PATH
		? // eslint-disable-next-line @typescript-eslint/no-var-requires
		  require(process.env.VSG_WEBPACK_PATH).ProgressPlugin
		: ProgressPluginNormal

	if (
		config.progressBar !== false &&
		!((config.webpackConfig && config.webpackConfig.plugins) || []).some(
			p => p?.constructor === ProgressPlugin
		)
	) {
		const { plugin, bar: localBar } = getProgressPlugin('Compiling')
		bar = localBar
		config.webpackConfig.plugins = [...(config.webpackConfig.plugins || []), plugin]
	}
	const { app, compiler } = server(config, (err: Error) => {
		if (err) {
			console.error(err)
		} else {
			const isHttps = compiler.options.devServer && compiler.options.devServer.https
			const urls = webpackDevServerUtils.prepareUrls(
				isHttps ? 'https' : 'http',
				config.serverHost,
				config.serverPort
			)

			if (config.printServerInstructions) {
				config.printServerInstructions(config, { isHttps: !!isHttps })
			} else {
				printServerInstructions(
					urls,
					compiler.options.devServer && compiler.options.devServer.publicPath
						? compiler.options.devServer.publicPath.replace(/^\//, '')
						: ''
				)
			}

			if (bar) {
				bar.start(1, 0)
			}

			if (open) {
				openBrowser(urls.localUrlForBrowser)
			}
		}
	})

	verbose('Webpack config:', compiler.options)

	// Custom error reporting
	compiler.hooks.done.tap('vsgErrorDone', function (stats: Stats) {
		if (bar) {
			bar.stop()
			moveCursor(process.stdout, 0, -1)
			clearLine(process.stdout, 0)
		}

		const messages = formatWebpackMessages(stats.toJson({}) as any)

		if (!messages.errors.length && !messages.warnings.length) {
			printStatus('Compiled successfully!', 'success')
		}

		printAllErrorsAndWarnings(messages, stats.compilation)
	})

	// kill ghosted threads on exit
	;(['SIGINT', 'SIGTERM'] as const).forEach(signal => {
		process.on(signal, () => {
			app.stop()
		})
	})

	// in order to have the caller be able to interact
	// with the app when it's hot
	return { app, compiler }
}

export function commandHelp() {
	console.log(
		[
			kleur.underline('Usage'),
			'',
			'    ' +
				kleur.bold('styleguidist') +
				' ' +
				kleur.cyan('<command>') +
				' ' +
				kleur.yellow('[<options>]'),
			'',
			kleur.underline('Commands'),
			'',
			'    ' + kleur.cyan('build') + '           Build style guide',
			'    ' + kleur.cyan('server') + '          Run development server',
			'    ' + kleur.cyan('help') + '            Display React Styleguidist help',
			'',
			kleur.underline('Options'),
			'',
			'    ' + kleur.yellow('--config') + '        Config file path',
			'    ' + kleur.yellow('--open') + '          Open Styleguidist in the default browser',
			'    ' + kleur.yellow('--verbose') + '       Print debug information'
		].join('\n')
	)
}

/**
 * @param {object} urls
 * @param {string} publicPath
 */
function printServerInstructions(urls: webpackDevServerUtils.Urls, publicPath: string) {
	console.log()
	console.log(`You can now view your style guide in the browser:`)
	console.log()
	console.log(`  ${kleur.bold('Local:')}            ${urls.localUrlForTerminal + publicPath}`)
	if (urls.lanUrlForTerminal) {
		console.log(`  ${kleur.bold('On your network:')}  ${urls.lanUrlForTerminal + publicPath}`)
	}
	console.log()
}

/**
 * @param {object} config
 */
function printBuildInstructions(config: SanitizedStyleguidistConfig) {
	console.log('Style guide published to:\n' + kleur.underline(config.styleguideDir || ''))
}

/**
 * @param {string} message
 * @param {string} linkTitle
 * @param {string} linkUrl
 */
export function printErrorWithLink(message: string, linkTitle: string, linkUrl: string) {
	console.error(`${kleur.bold().red(message)}\n\n${linkTitle}\n${kleur.underline(linkUrl)}\n`)
}

/**
 * @param {string} header
 * @param {object} errors
 * @param {object} originalErrors
 * @param {'success'|'error'|'warning'} type
 */
type MessageType = 'success' | 'error' | 'warning'

function printErrors(
	header: string,
	errors: (string | Error)[],
	originalErrors: (string | Error)[],
	type: MessageType
) {
	printStatus(header, type)
	console.error()
	const messages = process.env.VUESG_VERBOSE ? originalErrors : errors
	messages.forEach(message => {
		console.error(typeof message === 'string' ? message : message.message)
	})
}

/**
 * @param {string} text
 * @param {'success'|'error'|'warning'} type
 */
function printStatus(text: string, type: MessageType) {
	if (type === 'success') {
		console.log(kleur.inverse().bold().green(' DONE ') + ' ' + text)
	} else if (type === 'error') {
		console.error(kleur.inverse().bold().red(' FAIL ') + ' ' + kleur.red(text))
	} else {
		console.error(kleur.inverse().bold().yellow(' WARN ') + ' ' + kleur.yellow(text))
	}
}

/**
 * @param {object} messages
 * @param {object} compilation
 * @return {boolean}
 */
function printAllErrorsAndWarnings(
	messages: {
		errors: string[]
		warnings: string[]
	},
	compilation: {
		errors: WebpackError[]
		warnings: WebpackError[]
	}
) {
	// If errors exist, only show errors
	if (messages.errors.length) {
		printAllErrors(messages.errors, compilation.errors)
		return true
	}

	// Show warnings if no errors were found
	if (messages.warnings.length) {
		printAllWarnings(messages.warnings, compilation.warnings)
	}

	return false
}

/**
 * @param {object} errors
 * @param {object} originalErrors
 */
function printAllErrors(errors: string[], originalErrors: WebpackError[]) {
	printStyleguidistError(errors)
	printNoLoaderError(errors)
	printErrors('Failed to compile', errors, originalErrors, 'error')
}

/**
 * @param {object} warnings
 * @param {object} originalWarnings
 */
function printAllWarnings(warnings: string[], originalWarnings: WebpackError[]) {
	printErrors('Compiled with warnings', warnings, originalWarnings, 'warning')
}

/**
 * @param {object} errors
 */
function printStyleguidistError(errors: string[]) {
	const styleguidistError = errors.find(message =>
		message.includes('Module build failed: Error: Styleguidist:')
	)
	if (!styleguidistError) {
		return
	}

	const m = styleguidistError.match(/Styleguidist: (.*?)\n/)
	if (m) {
		printErrorWithLink(m[1], 'Learn how to configure your style guide:', consts.DOCS_CONFIG)
	}
	process.exit(1)
}

/**
 * @param {object} errors
 */
function printNoLoaderError(errors: string[]) {
	if (process.env.VUESG_VERBOSE) {
		return
	}

	const noLoaderError = errors.find(message =>
		message.includes('You may need an appropriate loader')
	)
	if (!noLoaderError) {
		return
	}

	printErrorWithLink(
		noLoaderError,
		'Learn how to add webpack loaders to your style guide:',
		consts.DOCS_WEBPACK
	)
	process.exit(1)
}

/**
 * @param {string} header
 * @param {object} object
 */
export function verbose(header: string, object: any) {
	logger.debug(kleur.bold(header) + '\n\n' + stringify(object))
}
