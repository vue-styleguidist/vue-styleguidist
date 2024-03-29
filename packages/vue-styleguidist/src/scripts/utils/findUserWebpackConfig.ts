const USER_WEBPACK_CONFIG_NAMES = [
	'./webpack.config.js',
	'./webpackfile.js',
	'@vue/cli-service/webpack.config.js'
]

/**
 * Find user’s Webpack config and return its path.
 * Fixed location for Create React App or webpack.config.js in the root directory.
 * Returns false if config not found.
 *
 * @return {string|boolean}
 */
export default function findUserWebpackConfig({ rootDir }: { rootDir: string }): string | boolean {
	// Check in the root folder
	for (const configFile of USER_WEBPACK_CONFIG_NAMES) {
		try {
			return require.resolve(configFile, {paths: [rootDir, process.cwd()]})
		} catch (e) {
			// if file not found, eat the error
		}
	}

	return false
}
