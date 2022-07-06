import webpack, { Configuration } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import merge from 'webpack-merge'
import { SanitizedStyleguidistConfig } from '../types/StyleGuide'
import makeWebpackConfig from './make-webpack-config'
import { ServerInfo } from './binutils'

const isWebpack4 = webpack.version?.startsWith('4.')

export default function createServer(
	config: SanitizedStyleguidistConfig,
	env: 'development' | 'production' | 'none'
): ServerInfo {
	const webpackConfig: Configuration = makeWebpackConfig(config, env)

	const serverWebpackConfig = isWebpack4
		? webpackConfig
		: merge(webpackConfig, {
				infrastructureLogging: {
					level: 'warn'
				},
				stats: 'errors-only'
		  })

	const { devServer: webpackDevServerConfig } = merge(
		{
			devServer: isWebpack4
				? {
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
						hot: true
				  }
		},
		{
			devServer: webpackConfig.devServer
		},
		isWebpack4
			? {
					devServer: {
						contentBase: config.assetsDir
					}
			  }
			: {}
	)

	const compiler = webpack(serverWebpackConfig)
	const devServer = isWebpack4
		? new WebpackDevServer(compiler, webpackDevServerConfig)
		: // @ts-ignore for webpack 5 compatibility
		  new WebpackDevServer(webpackDevServerConfig, compiler)

	// User defined customizations
	if (config.configureServer) {
		config.configureServer(devServer, env)
	}

	return { app: devServer, compiler }
}
