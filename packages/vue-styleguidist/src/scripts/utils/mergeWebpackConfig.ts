import { Configuration, WebpackPluginInstance } from 'webpack'
import isFunction from 'lodash/isFunction'
import omit from 'lodash/omit'
import * as mergeBase from 'webpack-merge'

const IGNORE_SECTIONS = ['entry', 'output', 'watch', 'stats', 'styleguidist']
const IGNORE_SECTIONS_ENV: { [key: string]: string[] } = {
	development: [],
	// For production builds, we'll ignore devtool settings to avoid
	// source mapping bloat.
	production: ['devtool'],
	removePlugins: ['plugins']
}

const IGNORE_PLUGINS = [
	'CommonsChunkPlugins',
	'MiniHtmlWebpackPlugin',
	'HtmlWebpackPlugin',
	'OccurrenceOrderPlugin',
	'DedupePlugin',
	'UglifyJsPlugin',
	'HotModuleReplacementPlugin'
]

// @ts-expect-error types are outdated
const merge = mergeBase.mergeWithCustomize({
	// Ignore user’s plugins to avoid duplicates and issues with our plugins
	customizeArray: mergeBase.unique(
		'plugins',
		IGNORE_PLUGINS,
		(plugin: WebpackPluginInstance) => plugin.constructor && plugin.constructor.name
	)
})

//make it a typeguard
function isFunc(
	conf: Configuration | ((env: string) => Configuration)
): conf is (env: string) => Configuration {
	return isFunction(conf)
}

/**
 * Merge two Webpack configs.
 *
 * In the user config:
 * - Ignores given sections (options.ignore).
 * - Ignores plugins that shouldn’t be used twice or may cause issues.
 *
 * @param {object} baseConfig
 * @param {object|Function} userConfig
 * @param {string} env
 * @return {object}
 */
export default function mergeWebpackConfig(
	baseConfig: Configuration,
	userConfig: Configuration | ((env: string) => Configuration),
	env_: string
): Configuration {
	const userConfigObject = isFunc(userConfig) ? userConfig(env_) : userConfig
	const safeUserConfig = omit(userConfigObject, IGNORE_SECTIONS.concat(IGNORE_SECTIONS_ENV[env_]))
	return merge(baseConfig, safeUserConfig)
}
