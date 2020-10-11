import Vue from 'vue'
import { cleanName } from 'vue-inbrowser-compiler-utils'

// require context the components root
const requireComponent = require.context(
	'../components',
	// look in subfolders
	true,
	//only get vue components
	/[A-Z]\w+\.vue$/
)

// require context the components root and resolve their documentations
const requireComponentDocs = require.context(
	'!!vue-simple-docgen-loader!../components',
	// look in subfolders
	true,
	//only get vue components
	/[A-Z]\w+\.vue$/
)

// For each matching file name...
requireComponent.keys().forEach(async fileName => {
	// Get the component config
	const componentConfig = requireComponent(fileName)

	// Get the components docs
	const componentDocs = requireComponentDocs(fileName)

	// Get the PascalCase version of the component name
	const componentName = cleanName(componentDocs.displayName)

	// Globally register the component
	Vue.component(componentName, componentConfig.default || componentConfig)
})
