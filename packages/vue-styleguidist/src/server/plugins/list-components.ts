import { Plugin } from 'vite'
import ComponentStore from '../component-store'

export interface Section {
	name: string
	components: string[]
	sections?: Section[]
}

export interface ComponentTreeOptions {
	/**
	 * The root to use for each glob in the tree
	 */
	componentRoot?: string
	components?: string[]
	sections?: Section[]
}

export default function ComponentTreePlugin(options: ComponentTreeOptions = {}): Plugin {
	let componentStore: ComponentStore

	return {
		name: 'vite-plugin-styleguidist-provider',
		configResolved(config) {
			const { componentRoot = 'src', components = [], sections = [] } = options
			componentStore = new ComponentStore({
				projectRoot: config.root,
				componentRoot,
				components,
				sections
			})
		},
		resolveId(id) {
			if (id === 'vsg:menu-tree' || id === 'vsg:routes' || id.startsWith('vsg:page-components:')) {
				return id
			}
		},
		async load(id) {
			if (id === 'vsg:menu-tree') {
				const menuTree = await componentStore.getMenuTree()
				return `export default ${JSON.stringify(menuTree)}`
			}

			if (id.startsWith('vsg:page-components:')) {
				const compName = id.slice(20)
				const comp = await componentStore.getComponentsFromRoute(compName)
				return `export default ${JSON.stringify(comp)}`
			}

			if (id.startsWith('vsg:router')) {
				const routes = componentStore.getRoutesList()
				return `export default ${JSON.stringify(routes)}`
			}
		}
	}
}
