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
			devServer: {
				compress: true
			}
		},
		{
			devServer: webpackConfig.devServer
		},
		{
			devServer: {}
		}
	)

	const compiler = webpack(webpackConfig)
	const devServer = new WebpackDevServer(webpackDevServerConfig ?? {}, compiler)

	// User defined customizations
	if (config.configureServer) {
		config.configureServer(devServer, env)
	}

	return { app: devServer, compiler }
}
