import webpack, { Configuration } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import merge from 'webpack-merge'
import { ProcessedStyleGuidistConfigObject } from 'types/StyleGuide'
import makeWebpackConfig from './make-webpack-config'

export default function createServer(
	config: ProcessedStyleGuidistConfigObject,
	env: 'development' | 'production' | 'none'
) {
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
