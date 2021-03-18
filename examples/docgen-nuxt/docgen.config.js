const path = require('path')
const templates = require('./docs/templates')

/** @type import("vue-docgen-cli").DocgenCLIConfig */
module.exports = {
	docsRepo: 'vue-styleguidist/vue-styleguidist',
	docsBranch: 'dev',
	docsFolder: 'examples/docgen-nuxt',
	componentsRoot: 'components',
	components: '**/[A-Z]*.vue',
	outDir: './docs/en',
	defaultExamples: true,
	getDestFile: (componentPath, config) => {
		return path.join(config.outDir, componentPath).replace(/\/\w+\.vue$/, '.md')
	},
	templates
}
