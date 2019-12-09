import webpack, { Configuration } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import merge from 'webpack-merge'
import { StyleguidistConfig } from '../types/StyleGuide'
import makeWebpackConfig from './make-webpack-config'
import { ServerInfo } from './binutils'

export default function createServer(
	config: StyleguidistConfig,
	env: 'development' | 'production' | 'none'
): ServerInfo {
	const webpackConfig: Configuration = makeWebpackConfig(config, env)
	const { devServer: webpackDevServerConfig } = merge(
		{
			devServer: {
				noInfo: true,
				compress: true,
				clientLogLevel: 'none',
				hot: true,
				quiet: true,
				watchOptions: {
					ignored: /node_modules/
				},
				watchContentBase: config.assetsDir !== undefined,
				stats: webpackConfig.stats || {}
			}
		},
		{
			devServer: webpackConfig.devServer
		},
		{
			devServer: {
				contentBase: config.assetsDir
			}
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
