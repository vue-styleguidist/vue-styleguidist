const vueLoader = require('vue-loader');
const mergeBase = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const mergeWebpackConfig = require('./mergeWebpackConfig');

module.exports = function mergeWebpackConfigVueCLI(baseConfig, userConfig, env) {
	// When brings the vue-cli webpackcongif should remove his plugins,
	// but the new version of vue-loader need to add the plugin VueLoaderPlugin to work
	// so, to add VueLoaderPlugin again
	if (vueLoader.VueLoaderPlugin) {
		const filterWebpackUserConfig = mergeWebpackConfig({}, userConfig, env);
		const webpackConfig = mergeWebpackConfig(
			mergeBase(baseConfig, {
				plugins: [
					new vueLoader.VueLoaderPlugin(),
					new MiniCssExtractPlugin({
						chunkFilename: 'css/[name].[contenthash:8].css',
						filename: 'css/[name].[contenthash:8].css',
					}),
				],
			}),
			filterWebpackUserConfig,
			'removePlugins'
		);
		const rules = webpackConfig.module.rules;

		// If there is cache-loader inside .vue rule, it should be removed
		// the new version of vue-loader generates error with cache-loader
		webpackConfig.module.rules = rules.map(rule => {
			if (rule.test && rule.test.test('.vue')) {
				return {
					test: rule.test,
					use: rule.use.filter(use => use.loader === 'vue-loader'),
				};
			}
			return rule;
		});

		return webpackConfig;
	}
	return baseConfig;
};
