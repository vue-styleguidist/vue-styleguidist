import { resolve } from 'path'
import { Plugin } from 'vite'
import ComponentStore from '../component-store'

export interface Section {
	name: string
	components: string[]
	sections?: Section[]
}

export interface ResolvedSection {
	name: string
	components: VsgTreeItem[]
	sections: ResolvedSection[]
}

export interface ComponentTreeOptions {
	/**
	 * The root to use for each glob in the tree
	 */
	componentRoot?: string
	components?: string[]
	sections?: Section[]
}

export interface VsgTreeItem {
	routeName: string
	filePath: string
	label: string
}

export default function ComponentTreePlugin(options: ComponentTreeOptions = {}): Plugin {
	const { componentRoot = 'src', components = [], sections = [] } = options
	let root: string = ''

	let componentStore: ComponentStore

	return {
		name: 'vite-plugin-component-tree',
		configResolved(config) {
			root = resolve(config.root, componentRoot)
		},
		resolveId(id) {
			if (id === 'vsg:menu-tree' || id.startsWith('vsg:page-components:')) {
				return id
			}
		},
		async load(id) {
			if (id === 'vsg:menu-tree') {
				return `export default {}`
			}

			if (id.startsWith('vsg:page-components:')) {
				return `export default []`
			}
		}
	}
}
