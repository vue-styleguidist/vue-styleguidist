/// @ts-check
const { defineConfig } = require('vue-docgen-cli');
const path = require('path');
const { createComponentMetaChecker } = require('vue-component-meta')

const tsconfigPath = path.resolve(__dirname, './tsconfig.json');
const checker = createComponentMetaChecker(tsconfigPath);

module.exports = defineConfig({
	docsRepo: 'vue-styleguidist/vue-styleguidist',
	docsBranch: 'dev',
	docsFolder: 'examples/docgen',
	componentsRoot: 'src/components',
	components: './[A-Z]*.vue',
	outDir: './docs/components',
	defaultExamples: true,
  propsParser(componentPath, _, event) {
		if(event === 'add'){
			checker.reload()
		}
    const exportNames = checker.getExportNames(componentPath);
    return Promise.resolve(exportNames.map(exportName => {
      const meta = checker.getComponentMeta(componentPath)

      const nonGlobalProps = meta.props.filter(prop => !prop.global)

      // massage the output of meta to match the docgen format
      const props = nonGlobalProps.length ? nonGlobalProps.map(p => ({
        ...p, 
        type: {
          name: p.type 
        },
        tags: p.tags.reduce((acc, t) => {
          acc[t.name] = t.text
          return acc
        }, {})
      })) : undefined

      const slots = meta.slots.length ? meta.slots.map(s => ({
        name: s.name,
      })) : undefined

      const events = meta.events.length ? meta.events.map(s => ({
        name: s.name,
      })) : undefined

      return {
        props, 
        slots,
        events,
        displayName: componentPath.split('/').pop()?.replace(/\.(ts|js|vue)/, '') || 'unknown', 
        exportName, 
        tags: {}
      }
    }))
  }
})
