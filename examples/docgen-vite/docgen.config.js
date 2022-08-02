/* eslint-disable compat/compat */
/// @ts-check
const { defineConfig } = require('vue-docgen-cli');
const path = require('path');
const { createComponentMetaChecker } = require('vue-component-meta')

const tsconfigPath = path.resolve(__dirname, './tsconfig.json');
	const checker = createComponentMetaChecker(tsconfigPath, {
		forceUseTs: true,
		printer: { newLine: 1 },
	});

module.exports = defineConfig({
	docsRepo: 'vue-styleguidist/vue-styleguidist',
	docsBranch: 'dev',
	docsFolder: 'examples/docgen',
	componentsRoot: 'src/components',
	components: './[A-Z]*.vue',
	outDir: './docs/components',
	defaultExamples: true,
  propsParser(componentPath) {
    const exportNames = checker.getExportNames(componentPath);
    return Promise.resolve(exportNames.map(exportName => {
      const meta = checker.getComponentMeta(componentPath, exportName)

      // massage the output of meta to match the docgen format
      const props = meta.props.map(p => ({
        ...p, 
        type: {
          name: p.type 
        },
        tags: p.tags.reduce((acc, t) => {
          acc[t.name] = t.text
          return acc
        }, {})
      }))
      return {
        props, 
        displayName: componentPath.split('/').pop()?.replace(/\.(ts|js|vue)/, '') || 'noname', 
        exportName, 
        tags: {}
      }
    }))
  }
})
