import WebpackDevServer from 'webpack-dev-server'

/**
 * This change was introduced because webpack is now declaring types through
 * a namespace and not a module anymore so @types/webpack-dev-server are not enough
 */
declare namespace webpack {
	interface Configuration {
		/**
		 * Can be used to configure the behaviour of webpack-dev-server when
		 * the webpack config is passed to webpack-dev-server CLI.
		 */
		devServer?: WebpackDevServer.Configuration
	}
}
