const vsg = require('vue-styleguidist')
const merge = require('webpack-merge')
const configSchemaImport = require('vue-styleguidist/lib/scripts/schemas/config')

const configSchema = configSchemaImport.default || configSchemaImport
const styleguidist = vsg.default || vsg

module.exports = (api, options) => {
	api.configureWebpack(() => ({
		// make sure that the docs blocks
		// are ignored during normal serve & build
		module: {
			rules: [
				{
					resourceQuery: /blockType=docs/,
					loader: 'null-loader'
				}
			]
		}
	}))

	api.registerCommand(
		'styleguidist:build',
		{
			description: 'build the styleguidist website',
			usage: 'vue-cli-service styleguidist:build [options]',
			options: {
				'--config': 'path to the config file',
				'--verbose': 'show the full log'
			}
		},
		args => {
			getStyleguidist(args, api, options).binutils.build()
		}
	)

	api.registerCommand(
		'styleguidist',
		{
			description: 'launch the styleguidist dev server',
			usage: 'vue-cli-service styleguidist [options]',
			options: {
				'--config': 'path to the config file',
				'--verbose': 'show the full log',
				'--port': 'port to start the server on'
			}
		},

		args => {
			const server = getStyleguidist(args, api, options).binutils.server(args.open).app

			// in order to avoid ghosted threads at the end of tests
			;['SIGINT', 'SIGTERM'].forEach(signal => {
				process.on(signal, () => {
					server.close(() => {
						process.exit(0)
					})
				})
			})

			// in tests, killing the process with SIGTERM causes execa to
			// throw
			if (process.env.VUE_CLI_TEST) {
				process.stdin.on('data', data => {
					if (data.toString() === 'close') {
						// eslint-disable-next-line no-console
						console.log('got close signal!')
						server.close(() => {
							process.exit(0)
						})
					}
				})
			}
		}
	)
}

function getStyleguidist(args, api, options) {
	const conf = api.resolve(args.config || './styleguide.config.js')
	const sgConf = conf && conf.length ? require(conf) : {}

	// reset the default component expression
	sgConf.components = sgConf.components || 'src/components/**/[A-Z]*.vue'

	if (args.verbose !== undefined) {
		sgConf.verbose = !!args.verbose
	}

	if (args.port !== undefined) {
		sgConf.serverPort = parseInt(args.port, 10)
	}

	const userWebpackConfig = sgConf.webpackConfig
	options.outputDir = sgConf.styleguideDir || configSchema.styleguideDir.default
	const cliWebpackConfig = getConfig(api)
	return styleguidist(
		sgConf,
		config => (config.webpackConfig = merge(cliWebpackConfig, userWebpackConfig))
	)
}

/**
 * Make webpackConfig for styleguidist
 * @param {Object} api
 */
function getConfig(api) {
	const conf = api.resolveChainableWebpackConfig()

	// avoid annoying notification when everything works
	if (conf.plugins.has('fork-ts-checker')) {
		conf.plugin('fork-ts-checker').tap(args => {
			args[0].logger = {
				// eslint-disable-next-line no-console
				warn: console.warn,
				// eslint-disable-next-line no-console
				error: console.error,
				info: function() {}
			}
			return args
		})
	}

	// because we are dealing with hot replacement in vsg
	// remove duplicate hot module reload plugin
	conf.plugins.delete('hmr')

	// remove the double compiled successfully message
	conf.plugins.delete('friendly-errors')
	return api.resolveWebpackConfig(conf)
}
