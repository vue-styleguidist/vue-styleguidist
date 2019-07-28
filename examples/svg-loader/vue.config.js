module.exports = {
	chainWebpack: config => {
		const svgRule = config.module.rule('svg')
		svgRule.uses.clear()
		svgRule.use('vue-svg-loader').loader('vue-svg-loader')

		const babelRule = config.module.rule('js')
		babelRule.exclude.add(/packages/)

		const lintRule = config.module.rule('eslint')
		lintRule.exclude.add(/packages/)
	}
}
