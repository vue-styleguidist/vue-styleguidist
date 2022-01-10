/// <reference types="vite/client" />

declare module '*.vue' {
	import { DefineComponent } from 'vue'
	// eslint-disable-next-line
	const component: DefineComponent<{}, {}, any>
	export default component
}

declare module 'vsg:routes' {
	import { RouteRecordRaw } from 'vue-router'

	const routes: RouteRecordRaw[]
	export default routes
}

declare module 'vsg:menu-tree' {
	// FIXME: give the real path where the types are defined
	import { VsgTreeItem } from '@types'

	const menuTree: VsgTreeItem[]
	export default menuTree
}

declare module 'vsg:page-components:*' {
	// FIXME: give the real path where the types are defined
	import { RunTimeComponents } from '@types'

	const pageComponents: RunTimeComponents[]
	export default pageComponents
}
