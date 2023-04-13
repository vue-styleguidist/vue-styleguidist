import cac from 'cac'
import * as log from 'loglevel'
import extractConfig from './extractConfig'
import docgen from './docgen'
import { SafeDocgenCLIConfig } from './config'

const CLI = cac('vue-docgen-cli')

log.debug('[vue-docgen-cli] start')

/**
 * run the `config` recursively on pages
 * @param config
 */
function run(config: SafeDocgenCLIConfig) {
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

CLI.command('[componentsGlob] [outFile]', 'generate documentation')
	.option('-c, --configFile <configFile>', 'Path to the config file')
	.option('-w, --watch', 'turn on watch mode', { default: false })
	.option('--cwd', 'where to look for the config file')
	.option('--logLevel <logLevel>', 'level of verbosity the CLI will be', {
    default: [],
		type: ['trace', 'debug', 'info', 'warn', 'error']
	})
	.option('-v, --verbose', 'equivalent to --logLevel=debug', { default: false })
	.action(async (componentsGlob, outFile, options) => {
		const { configFile, watch, cwd, logLevel:[logLevel], verbose } = options
		const conf = await extractConfig(
			cwd || process.cwd(),
			watch,
			configFile,
			[componentsGlob, outFile],
			verbose,
			logLevel
		).catch(err => {
			log.setLevel('error')
			log.error(err)
			process.exit(1)
		})

		run(conf)
	})

  CLI.help()

  CLI.parse()

  CLI.version(require('../package.json').version)
