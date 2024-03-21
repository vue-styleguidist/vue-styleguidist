/** @type import("vue-docgen-cli").DocgenCLIConfig */
module.exports = {
	docsRepo: 'vue-styleguidist/vue-styleguidist',
	docsBranch: 'dev',
	docsFolder: 'examples/docgen',
	componentsRoot: 'src/components',
	components: '**/[A-Z]*.(vue|ts)',
	outDir: './docs/components',
	defaultExamples: true
}
