// Make sure user has webpack installed
import 'react-styleguidist/lib/scripts/utils/ensureWebpack'
import { Stats } from 'webpack'
import { ProcessedStyleGuidistConfigObject } from 'types/StyleGuide'
import setupLogger from 'react-styleguidist/lib/scripts/logger'
import build from './build'
import server from './server'
import makeWebpackConfig from './make-webpack-config'
import getConfig from './config'
import * as binutils from './binutils'

/**
 * Initialize Vue Styleguide API.
 *
 * @param {object} [config] Styleguidist config.
 * @param {function} [updateConfig] update config post resolution
 * @returns {object} API.
 */
export default function(
	config: ProcessedStyleGuidistConfigObject,
	updateConfig: (conf: ProcessedStyleGuidistConfigObject) => void
) {
	config = getConfig(config, (config: ProcessedStyleGuidistConfigObject) => {
		setupLogger(config.logger, config.verbose, {})
		if (typeof updateConfig === 'function') {
			updateConfig(config)
		}
		return config
	})

	return {
		/**
		 * Build style guide.
		 *
		 * @param {Function} callback callback(err, config, stats).
		 * @return {Compiler} Webpack Compiler instance.
		 */
		build(
			callback: (
				err: Error | undefined,
				config: ProcessedStyleGuidistConfigObject,
				stats: Stats
			) => void
		) {
			return build(config, (err, stats) => callback(err, config, stats))
		},

		/**
		 * Start style guide dev server.
		 *
		 * @param {Function} callback callback(err, config).
		 * @return {ServerInfo.App} Webpack-Dev-Server.
		 * @return {ServerInfo.Compiler} Webpack Compiler instance.
		 */
		server(callback: (err: Error | undefined, config: ProcessedStyleGuidistConfigObject) => void) {
			return server(config, err => callback(err, config))
		},

		/**
		 * Return Styleguidist Webpack config.
		 *
		 * @param {string} [env=production] 'production' or 'development'.
		 * @return {object}
		 */
		makeWebpackConfig(env: 'development' | 'production' | 'none') {
			return makeWebpackConfig(config, env || 'production')
		},

		binutils: {
			server: (open: boolean) => binutils.commandServer(config, open),
			build: () => binutils.commandBuild(config)
		}
	}
}
