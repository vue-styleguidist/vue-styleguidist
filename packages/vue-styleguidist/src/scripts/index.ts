// Make sure user has webpack installed
import 'react-styleguidist/lib/scripts/utils/ensureWebpack'
import { Stats, Configuration, Compiler } from 'webpack'
import setupLogger from 'react-styleguidist/lib/scripts/logger'
import { StyleguidistConfig } from '../types/StyleGuide'
import buildUtil from './build'
import server from './server'
import makeWebpackConfig from './make-webpack-config'
import getConfig from './config'
import * as binutils from './binutils'

export interface StyleGuideUtils {
	/**
	 * Build style guide.
	 *
	 * @param {Function} callback callback(err, config, stats).
	 * @return {Compiler} Webpack Compiler instance.
	 */
	build: (
		callback: (err: Error | undefined, config: StyleguidistConfig, stats: Stats) => void
	) => Compiler.Watching | Compiler

	/**
	 * Start style guide dev server.
	 *
	 * @param {Function} callback callback(err, config).
	 * @return {ServerInfo.App} Webpack-Dev-Server.
	 * @return {ServerInfo.Compiler} Webpack Compiler instance.
	 */
	server: (
		callback: (err: Error | undefined, config: StyleguidistConfig) => void
	) => binutils.ServerInfo

	/**
	 * Return Styleguidist Webpack config.
	 *
	 * @param {string} [env=production] 'production' or 'development'.
	 * @return {object}
	 */
	makeWebpackConfig: (env: 'development' | 'production' | 'none') => Configuration
	binutils: {
		server: (open: boolean) => binutils.ServerInfo
		build: () => Compiler
	}
}

/**
 * Initialize Vue Styleguide API.
 *
 * @param {object} [config] Styleguidist config.
 * @param {function} [updateConfig] update config post resolution
 * @returns {object} API.
 */
export default function(
	config: StyleguidistConfig,
	updateConfig: (conf: StyleguidistConfig) => void
): StyleGuideUtils {
	config = getConfig(config, (config: StyleguidistConfig) => {
		setupLogger(config.logger, config.verbose, {})
		if (typeof updateConfig === 'function') {
			updateConfig(config)
		}
		return config
	})

	return {
		build(callback) {
			return buildUtil(config, (err, stats) => callback(err, config, stats))
		},

		server(callback) {
			return server(config, err => callback(err, config))
		},

		makeWebpackConfig(env: 'development' | 'production' | 'none') {
			return makeWebpackConfig(config, env || 'production')
		},

		binutils: {
			server: open => binutils.commandServer(config, open),
			build: () => binutils.commandBuild(config)
		}
	}
}
