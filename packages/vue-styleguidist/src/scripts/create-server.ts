import webpack, { Configuration } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import pkgWDS from 'webpack-dev-server/package.json'
import merge from 'webpack-merge'
import { SanitizedStyleguidistConfig } from '../types/StyleGuide'
import makeWebpackConfig from './make-webpack-config'
import { ServerInfo } from './binutils'

const isWDS3 = pkgWDS.version?.startsWith('3.')

export default function createServer(
	config: SanitizedStyleguidistConfig,
	env: 'development' | 'production' | 'none'
): ServerInfo {
	const webpackConfig: Configuration = makeWebpackConfig(config, env)

	const serverWebpackConfig = isWDS3
		? webpackConfig
		: merge(webpackConfig, {
				infrastructureLogging: {
					level: 'warn'
				},
				stats: 'errors-only'
		  })

	const { devServer: webpackDevServerConfig = {} } = merge(
		{
			devServer: isWDS3
				? {
            // @ts-ignore
						noInfo: true,
						clientLogLevel: 'none',
						hot: true,
						quiet: true,
						disableHostCheck: true,
						injectClient: false,
						watchOptions: {
							ignored: /node_modules/
						},
						watchContentBase: config.assetsDir !== undefined,
						stats: webpackConfig.stats || {}
				  }
				: {
						hot: true,
            port: config.serverPort,
            host: config.serverHost
				  }
		},
		{
			devServer: webpackConfig.devServer
		},
		isWDS3
			? {
					devServer: {
						contentBase: config.assetsDir
					}
			  }
			: {}
	)

	const compiler = webpack(serverWebpackConfig)
	const devServer = isWDS3
		? new WebpackDevServer(compiler, webpackDevServerConfig)
		: // @ts-ignore for webpack 5 compatibility
		  new WebpackDevServer(webpackDevServerConfig, compiler)

	// User defined customizations
	if (config.configureServer) {
		config.configureServer(devServer, env)
	}

	return { app: devServer, compiler }
}
