const vueLoader = require('vue-loader');
const mergeWebpackConfig = require('./mergeWebpackConfig');

module.exports = function mergeWebpackConfigVueCLI(baseConfig) {
	// When brings the vue-cli webpackcongif should remove his plugins,
	// but the new version of vue-loader need to add the plugin VueLoaderPlugin to work
	// so, to add VueLoaderPlugin again
	if (vueLoader.VueLoaderPlugin) {
		const newWebpackConfig = mergeWebpackConfig(
			{
				plugins: [new vueLoader.VueLoaderPlugin()],
			},
			baseConfig,
			'removePlugins'
		);
		const rules = newWebpackConfig.module.rules;

		// If there is cache-loader inside .vue rule, it should be removed
		// the new version of vue-loader generates error with cache-loader
		newWebpackConfig.module.rules = rules.map(rule => {
			if (rule.test && rule.test.test('.vue')) {
				return {
					test: rule.test,
					use: rule.use.filter(use => use.loader === 'vue-loader'),
				};
			} else if (rule.oneOf) {
				// Also, avoid to use "mini-css-extract-plugin" loader, they should be filtered
				// Because causes errors when tries to build
				return {
					...rule,
					oneOf: rule.oneOf.map(oneRule => {
						return {
							...oneRule,
							use: oneRule.use.filter(use => use.loader.indexOf('mini-css-extract-plugin') === -1),
						};
					}),
				};
			}
			return rule;
		});
		return newWebpackConfig;
	}
	return baseConfig;
};
