// Make sure user has webpack installed
require('./utils/ensureWebpack')
const setupLogger = require('react-styleguidist/lib/scripts/logger')

const build = require('./build')
const server = require('./server')
const makeWebpackConfig = require('./make-webpack-config')
const getConfig = require('./config')
const binutils = require('./binutils')

/**
 * Initialize Vue Styleguide API.
 *
 * @param {object} [config] Styleguidist config.
 * @param {function} [updateConfig] update config post resolution
 * @returns {object} API.
 */
module.exports = function(config, updateConfig) {
	config = getConfig(config, config => {
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
		build(callback) {
			return build(config, (err, stats) => callback(err, config, stats))
		},

		/**
		 * Start style guide dev server.
		 *
		 * @param {Function} callback callback(err, config).
		 * @return {ServerInfo.App} Webpack-Dev-Server.
		 * @return {ServerInfo.Compiler} Webpack Compiler instance.
		 */
		server(callback) {
			return server(config, err => callback(err, config))
		},

		/**
		 * Return Styleguidist Webpack config.
		 *
		 * @param {string} [env=production] 'production' or 'development'.
		 * @return {object}
		 */
		makeWebpackConfig(env) {
			return makeWebpackConfig(config, env || 'production')
		},

		binutils: {
			server: open => binutils.commandServer(config, open),
			build: () => binutils.commandBuild(config)
		}
	}
}
