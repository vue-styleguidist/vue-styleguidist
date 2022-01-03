import glob from 'fast-glob'
import micromatch from 'micromatch'
import { join } from 'path'
import { ComponentDoc, parseMulti } from 'vue-docgen-api'

export interface Section {
	name: string
	components: string[]
	sections?: Section[]
}

export interface VsgComponent {
	displayName: string
	routeName: string
	components?: VsgTreeItem[]
	docgenInfo: ComponentDoc
}

export interface VsgTreeItemLeaf {
	/**
	 * displayName as extracted from the documentation
	 */
	displayName: string
	routeName: string
}

export interface VsgTreeItemSection {
	displayName: string
	components: VsgTreeItem[]
}

/**
 * Represents one item in the main menu
 * can be either a component or a section
 * NOTE: if it has components, it's a section
 * NOTE2: if it is a section does it need a routeName?
 */
export type VsgTreeItem = VsgTreeItemLeaf | VsgTreeItemSection

export interface RuntimeComponents {
	/**
	 * To be used to import the component
	 * And its docs object
	 */
	filePath: string
}

export interface ComponentStoreOptions {
	projectRoot: string
	componentRoot: string
	components: string[]
	sections: Section[]
}

export default class ComponentStore {
	private componentRoot: string
	private components: string[]
	private sections: Section[]

	private componentGlobSet: Set<string>
	private realComponentRoot: string
	private routeMap: Record<string, RuntimeComponents[]>

	private _componentsTreeItems: Promise<VsgTreeItem[]> = Promise.resolve([])
	private _componentsTreeItemsInitialized: boolean | undefined
	private get componentsTreeItems() {
		if (!this._componentsTreeItemsInitialized) {
			this._componentsTreeItems = this.resolveComponentsTreeItems()
			this._componentsTreeItemsInitialized = true
		}
		return this._componentsTreeItems
	}

	private _sectionsTreeItems: Promise<VsgTreeItem[]> = Promise.resolve([])
	private _sectionsTreeItemsInitialized: boolean | undefined
	private get sectionsTreeItems() {
		if (!this._sectionsTreeItemsInitialized) {
			this._sectionsTreeItems = this.resolveSectionsTreeItems()
			this._sectionsTreeItemsInitialized = true
		}
		return this._sectionsTreeItems
	}

	constructor({ components, sections, componentRoot, projectRoot }: ComponentStoreOptions) {
		this.componentRoot = componentRoot
		this.components = components
		this.sections = sections
		this.realComponentRoot = join(projectRoot, componentRoot)
		this.componentGlobSet = new Set(this.components)
		this.routeMap = {}
	}

	private resolveComponentsTreeItems(): Promise<VsgTreeItem[]> {
		return this.resolveTreeItems(this.realComponentRoot, this.components)
	}

	private resolveSectionsTreeItems(topSections = this.sections): Promise<VsgTreeItem[]> {
		return Promise.all(
			topSections.map(async ({ name, components, sections }) => {
				return {
					displayName: name,
					components: [
						...(components?.length
							? await this.resolveTreeItems(this.realComponentRoot, components)
							: []),
						...(sections?.length ? await this.resolveSectionsTreeItems(sections) : [])
					]
				}
			})
		)
	}

	private async resolveTreeItems(
		realComponentRoot: string,
		components: string[]
	): Promise<VsgTreeItemLeaf[]> {
		return await components.reduce(async (acc, componentGlob) => {
			this.componentGlobSet.add(componentGlob)
			const globResult = await glob(componentGlob, { cwd: realComponentRoot })
			const treeItems = await globResult.reduce(async (accGlob, compPath) => {
				const docs = await parseMulti(join(realComponentRoot, compPath))
				const treeItemsInFile: VsgTreeItemLeaf[] = docs.map(doc => {
					return {
						displayName: doc.displayName,
						routeName: `${compPath}#${doc.exportName}`
					}
				})
				this.routeMap[compPath] = treeItemsInFile.map(item => ({
					filePath: join(this.componentRoot, compPath)
				}))
				return [...(await accGlob), ...treeItemsInFile]
			}, Promise.resolve([] as VsgTreeItemLeaf[]))
			return [...(await acc), ...treeItems]
		}, Promise.resolve([] as VsgTreeItemLeaf[]))
	}

	private async init() {
		await Promise.all([this.componentsTreeItems, this.sectionsTreeItems])
	}

	async getMenuTree(): Promise<VsgTreeItem[]> {
		const tree = [...(await this.componentsTreeItems), ...(await this.sectionsTreeItems)]
		return tree
	}

	async getComponentsFromRoute(routeName: string): Promise<RuntimeComponents[]> {
		await this.init()
		return this.routeMap[routeName]
	}

	async getRoutesList(): Promise<string[]> {
		await this.init()
		return Object.keys(this.routeMap)
	}

	async isFileValidComponent(filePath: string): Promise<boolean> {
		await this.init()
		return micromatch.isMatch(filePath, Array.from(this.componentGlobSet))
	}
}
