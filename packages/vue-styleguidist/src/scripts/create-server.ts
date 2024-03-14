import webpackNormal, { Configuration } from 'webpack'
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
			devServer: {
				compress: true,
				hot: true,
				client: {
					logging: 'none',
					progress: true
				}
			}
		},
		{
			devServer: webpackConfig.devServer
		}
	)

	const webpack: typeof webpackNormal = process.env.VSG_WEBPACK_PATH
		? require(process.env.VSG_WEBPACK_PATH)
		: webpackNormal

	const compiler = webpack({
		...webpackConfig,
		stats: 'errors-only',
		infrastructureLogging: { level: 'error' }
	})
	const app = new WebpackDevServer(webpackDevServerConfig, compiler)

	// User defined customizations
	if (config.configureServer) {
		config.configureServer(app, env)
	}

	return { app, compiler }
}
