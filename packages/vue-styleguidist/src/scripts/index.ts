// Make sure user has webpack installed
import 'react-styleguidist/lib/scripts/utils/ensureWebpack'
import { Stats, Configuration, Compiler, Watching } from 'webpack'
import { Theme } from 'react-styleguidist'
import setupLogger from 'react-styleguidist/lib/scripts/logger'
import { RecursivePartial } from 'react-styleguidist/lib/typings/RecursivePartial'
import { SanitizedStyleguidistConfig, StyleguidistConfig } from '../types/StyleGuide'
import buildUtil from './build'
import server from './server'
import makeWebpackConfig from './make-webpack-config'
import getConfig from './config'
import * as binutils from './binutils'
import isPromise from './utils/isPromise'

export type ThemeConfig = RecursivePartial<Theme>
export { StyleguidistConfig as Config }

export { defineConfig, defineEnhanceApp } from './helpers'

export interface StyleGuideUtils {
	/**
	 * Build style guide.
	 *
	 * @param {Function} callback callback(err, config, stats).
	 * @return {Compiler} Webpack Compiler instance.
	 */
	build: (
		callback: (
			err: Error | null | undefined,
			config: SanitizedStyleguidistConfig,
			stats: Stats | undefined
		) => void
	) => Watching | Compiler

	/**
	 * Start style guide dev server.
	 *
	 * @param {Function} callback callback(err, config).
	 * @return {ServerInfo.App} Webpack-Dev-Server.
	 * @return {ServerInfo.Compiler} Webpack Compiler instance.
	 */
	server: (
		callback: (err: Error | undefined, config: SanitizedStyleguidistConfig) => void
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
export default function (
	config: SanitizedStyleguidistConfig,
	updateConfig: (conf: SanitizedStyleguidistConfig) => void
): StyleGuideUtils | Promise<StyleGuideUtils> {
	const configInternal = getConfig(config, (cfg: SanitizedStyleguidistConfig) => {
		setupLogger(cfg.logger, cfg.verbose, {})
		if (typeof updateConfig === 'function') {
			updateConfig(cfg)
		}
		return cfg
	})

	if (isPromise(configInternal)) {
		return configInternal
			.then(conf => exportBuildUtils(conf))
			.catch(e => {
				throw e
			})
	} else {
		return exportBuildUtils(configInternal)
	}
}

function exportBuildUtils(config: SanitizedStyleguidistConfig): StyleGuideUtils {
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
