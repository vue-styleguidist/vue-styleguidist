/// <reference types="vite/client" />

declare module '*.vue' {
	import type { DefineComponent } from 'vue'

	const component: DefineComponent<{}, {}, any>
	export default component
}

declare module '*?docgen' {
	import type { ComponentDoc } from 'vite-plugin-vue-docgen'

	const componentDocs: ComponentDoc[]
	export default componentDocs
}
