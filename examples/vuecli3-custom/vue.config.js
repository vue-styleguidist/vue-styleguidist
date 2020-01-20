module.exports = {
	chainWebpack(conf) {
		// When using lerna and simlinks,
		// mode some modules that should be ignored are not
		// we add them here to avoid errors
		const path = require('path')
		const vueBrowserCompilerPath = path.resolve(
			path.dirname(require.resolve('vue-inbrowser-compiler')),
			'../'
		)

		const eslintRule = conf.module.rule('eslint')
		if (eslintRule) {
			const vsgPath = path.resolve(path.dirname(require.resolve('vue-styleguidist')), '../')

			eslintRule.exclude.add(vsgPath)
			eslintRule.exclude.add(vueBrowserCompilerPath)
			eslintRule.exclude.add(path.join(__dirname, 'styleguide'))
		}

		const jsRule = conf.module.rule('js')
		if (jsRule) {
			jsRule.exclude.add(vueBrowserCompilerPath)
		}
	}
}
