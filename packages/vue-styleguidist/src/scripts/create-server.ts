import webpack, { Configuration } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import merge from 'webpack-merge'
import { SanitizedStyleguidistConfig } from '../types/StyleGuide'
import makeWebpackConfig from './make-webpack-config'
import { ServerInfo } from './binutils'

export default function createServer(
	config: SanitizedStyleguidistConfig,
	env: 'development' | 'production' | 'none'
): ServerInfo {
	const webpackConfig: Configuration = makeWebpackConfig(config, env)
	const { devServer: webpackDevServerConfig } = merge(
		{
			devServer: webpack.version?.startsWith('4.')
				? {
						noInfo: true,
						compress: true,
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
						compress: true,
						hot: true
				  }
		},
		{
			devServer: webpackConfig.devServer
		},
		webpack.version?.startsWith('4.')
			? {
					devServer: {
						contentBase: config.assetsDir
					}
			  }
			: {
					infrastructureLogging: {
						level: 'warn'
					},
          stats: 'errors-only',
			  }
	)

	const compiler = webpack(webpackConfig)
	const devServer = new WebpackDevServer(compiler, webpackDevServerConfig)

	// User defined customizations
	if (config.configureServer) {
		config.configureServer(devServer, env)
	}

	return { app: devServer, compiler }
}
