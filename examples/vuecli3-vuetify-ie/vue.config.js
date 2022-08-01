const path = require('path')
const cliPath = require.resolve('@vue/cli-service')
console.log(path.dirname(cliPath))
const webpackPath = require.resolve('webpack', { paths: [path.dirname(cliPath)] })
process.env.VSG_WEBPACK_PATH = webpackPath

const transpileDependencies = [
	'regexpu-core',
	'strip-ansi',
	'ansi-regex',
	'ansi-styles',
	'react-dev-utils',
	'chalk',
	'unicode-match-property-ecmascript',
	'unicode-match-property-value-ecmascript',
	'acorn-jsx',
	'vuetify',
	'camelcase'
]

module.exports = {
	transpileDependencies,
	chainWebpack(conf) {
		// When using lerna and simlinks,
		// mode some modules that should be ignored are not
		// we add them here to avoid errors
		const path = require('path')

		const eslintRule = conf.module.rule('eslint')
		if (eslintRule) {
			eslintRule.exclude.add(path.resolve(__dirname, '../../packages'))
		}

		const jsRule = conf.module.rule('js')
		if (jsRule) {
			jsRule.exclude.add(path.resolve(__dirname, '../../packages'))
		}
	}
}
