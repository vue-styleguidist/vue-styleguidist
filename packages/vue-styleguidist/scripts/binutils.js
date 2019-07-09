/* eslint-disable no-console */

const kleur = require('kleur')
const ora = require('ora')
const stringify = require('q-i').stringify
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const webpackDevServerUtils = require('react-dev-utils/WebpackDevServerUtils')
const openBrowser = require('react-dev-utils/openBrowser')
const setupLogger = require('react-styleguidist/lib/scripts/logger')
const consts = require('./consts')
const logger = require('glogg')('vsg')

module.exports = {
	updateConfig,
	commandBuild,
	commandServer,
	commandHelp,
	verbose,
	printErrorWithLink
}

/**
 * @param {object} config
 * @return {object}
 */
function updateConfig(config) {
	// Set verbose mode from config option or command line switch
	config.verbose = config.verbose || process.env.VUESG_VERBOSE

	// Setup logger *before* config validation (because validations may use logger to print warnings)
	setupLogger(config.logger, config.verbose)

	return config
}

function commandBuild(config) {
	console.log('Building style guide...')

	const build = require('./build')
	const compiler = build(config, err => {
		if (err) {
			console.error(err)
			process.exit(1)
		} else if (config.printBuildInstructions) {
			config.printBuildInstructions(config)
		} else {
			printBuildInstructions(config)
		}
	})

	verbose('Webpack config:', compiler.options)

	// Custom error reporting
	compiler.hooks.done.tap('vsrDoneBuilding', function(stats) {
		const messages = formatWebpackMessages(stats.toJson({}, true))
		const hasErrors = printAllErrorsAndWarnings(messages, stats.compilation)
		if (hasErrors) {
			process.exit(1)
		}
	})

	// in order to have the caller be able to interact
	// with the compiler when i's hot
	return compiler
}

function commandServer(config, open) {
	let spinner

	const server = require('./server')
	const { app, compiler } = server(config, err => {
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
				config.printServerInstructions(config, { isHttps })
			} else {
				printServerInstructions(
					urls,
					compiler.options.devServer && compiler.options.devServer.publicPath
						? compiler.options.devServer.publicPath.replace(/^\//, '')
						: ''
				)
			}

			if (open) {
				openBrowser(urls.localUrlForBrowser)
			}
		}
	})
	/*	dangerouslyUpdateWebpackConfig(webpackConfig) {
		webpackConfig.devServer = webpackConfig.devServer || {}
		webpackConfig.devServer.publicPath = '/styleguide'
		webpackConfig.output.publicPath = '/styleguide'
		return webpackConfig
	}*/
	verbose('Webpack config:', compiler.options)

	// Show message when webpack is recompiling the bundle
	compiler.hooks.invalid.tap('vsgInvalidRecompilation', function() {
		console.log()
		spinner = ora('Compiling...').start()
	})

	// Custom error reporting
	compiler.hooks.done.tap('vsgErrorDone', function(stats) {
		if (spinner) {
			spinner.stop()
		}

		const messages = formatWebpackMessages(stats.toJson({}, true))

		if (!messages.errors.length && !messages.warnings.length) {
			printStatus('Compiled successfully!', 'success')
		}

		printAllErrorsAndWarnings(messages, stats.compilation)
	})

	// in order to have the caller be able to interact
	// with the app when it's hot
	return { app, compiler }
}

function commandHelp() {
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
function printServerInstructions(urls, publicPath) {
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
function printBuildInstructions(config) {
	console.log('Style guide published to:\n' + kleur.underline(config.styleguideDir))
}

/**
 * @param {string} message
 * @param {string} linkTitle
 * @param {string} linkUrl
 */
function printErrorWithLink(message, linkTitle, linkUrl) {
	console.error(`${kleur.bold.red(message)}\n\n${linkTitle}\n${kleur.underline(linkUrl)}\n`)
}

/**
 * @param {string} header
 * @param {object} errors
 * @param {object} originalErrors
 * @param {'success'|'error'|'warning'} type
 */
function printErrors(header, errors, originalErrors, type) {
	printStatus(header, type)
	console.error()
	const messages = process.env.VUESG_VERBOSE ? originalErrors : errors
	messages.forEach(message => {
		console.error(message.message || message)
	})
}

/**
 * @param {string} text
 * @param {'success'|'error'|'warning'} type
 */
function printStatus(text, type) {
	if (type === 'success') {
		console.log(kleur.inverse.bold.green(' DONE ') + ' ' + text)
	} else if (type === 'error') {
		console.error(kleur.inverse.bold.red(' FAIL ') + ' ' + kleur.red(text))
	} else {
		console.error(kleur.inverse.bold.yellow(' WARN ') + ' ' + kleur.yellow(text))
	}
}

/**
 * @param {object} messages
 * @param {object} compilation
 * @return {boolean}
 */
function printAllErrorsAndWarnings(messages, compilation) {
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
function printAllErrors(errors, originalErrors) {
	printStyleguidistError(errors)
	printNoLoaderError(errors)
	printErrors('Failed to compile', errors, originalErrors, 'error')
}

/**
 * @param {object} warnings
 * @param {object} originalWarnings
 */
function printAllWarnings(warnings, originalWarnings) {
	printErrors('Compiled with warnings', warnings, originalWarnings, 'warning')
}

/**
 * @param {object} errors
 */
function printStyleguidistError(errors) {
	const styleguidistError = errors.find(message =>
		message.includes('Module build failed: Error: Styleguidist:')
	)
	if (!styleguidistError) {
		return
	}

	const m = styleguidistError.match(/Styleguidist: (.*?)\n/)
	printErrorWithLink(m[1], 'Learn how to configure your style guide:', consts.DOCS_CONFIG)
	process.exit(1)
}

/**
 * @param {object} errors
 */
function printNoLoaderError(errors) {
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
function verbose(header, object) {
	logger.debug(kleur.bold(header) + '\n\n' + stringify(object))
}
