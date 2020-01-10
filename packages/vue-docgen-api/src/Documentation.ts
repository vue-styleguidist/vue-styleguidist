import Map from 'ts-map'

export type BlockTag = ParamTag | Tag

export interface Module {
	name: string
	path: string
}

/**
 * Universal model to display origin
 */
export interface Descriptor {
	extends?: Module
	mixin?: Module
}

export interface ParamType {
	name: string
	elements?: ParamType[]
}

export interface UnnamedParam {
	type?: ParamType
	description?: string | boolean
}

export interface Param extends UnnamedParam {
	name?: string
}

interface RootTag {
	title: string
}

export interface Tag extends RootTag {
	content: string | boolean
}

export interface ParamTag extends RootTag, Param {}

export interface DocBlockTags {
	description?: string
	tags?: Array<ParamTag | Tag>
}

interface EventType {
	names: string[]
}

interface EventProperty {
	type: EventType
	name?: string
	description?: string | boolean
}

export interface EventDescriptor extends DocBlockTags, Descriptor {
	name: string
	type?: EventType
	properties?: EventProperty[]
}

export interface PropDescriptor extends Descriptor {
	type?: { name: string; func?: boolean }
	description?: string
	required?: boolean
	defaultValue?: { value: string; func?: boolean }
	tags?: { [title: string]: BlockTag[] }
	values?: string[]
	name: string
}

export interface MethodDescriptor extends Descriptor {
	name: string
	description?: string
	returns?: UnnamedParam
	tags?: { [key: string]: BlockTag[] }
	params?: Param[]
	modifiers?: string[]
	[key: string]: any
}

export interface SlotDescriptor extends Descriptor {
	name: string
	description?: string
	bindings?: ParamTag[]
	scoped?: boolean
}

export interface ComponentDoc {
	displayName: string
	exportName: string
	description?: string
	props?: PropDescriptor[]
	methods?: MethodDescriptor[]
	slots?: SlotDescriptor[]
	events?: EventDescriptor[]
	tags?: { [key: string]: BlockTag[] }
	docsBlocks?: string[]
	[key: string]: any
}

export default class Documentation {
	private propsMap: Map<string, PropDescriptor>
	private methodsMap: Map<string, MethodDescriptor>
	private slotsMap: Map<string, SlotDescriptor>
	private eventsMap: Map<string, any>
	private dataMap: Map<string, any>
	private docsBlocks: string[] | undefined
	private originExtendsMixin: Descriptor

	constructor() {
		this.propsMap = new Map()
		this.methodsMap = new Map()
		this.slotsMap = new Map()
		this.eventsMap = new Map()
		this.originExtendsMixin = {}

		this.dataMap = new Map()
	}

	public setOrigin(origin: Descriptor) {
		this.originExtendsMixin = origin.extends ? { extends: origin.extends } : {}

		this.originExtendsMixin = origin.mixin ? { mixin: origin.mixin } : {}
	}

	public setDocsBlocks(docsBlocks: string[]) {
		this.docsBlocks = docsBlocks
	}

	public set(key: string, value: any) {
		this.dataMap.set(key, value)
	}

	public get(key: string): any {
		return this.dataMap.get(key)
	}

	public getPropDescriptor(propName: string): PropDescriptor {
		const vModelDescriptor = this.propsMap.get('v-model')
		return vModelDescriptor && vModelDescriptor.name === propName
			? vModelDescriptor
			: this.getDescriptor(propName, this.propsMap, () => ({
					name: propName
			  }))
	}

	public getMethodDescriptor(methodName: string): MethodDescriptor {
		return this.getDescriptor(methodName, this.methodsMap, () => ({
			name: methodName
		}))
	}

	public getEventDescriptor(eventName: string): EventDescriptor {
		return this.getDescriptor(eventName, this.eventsMap, () => ({
			name: eventName
		}))
	}

	public getSlotDescriptor(slotName: string): SlotDescriptor {
		return this.getDescriptor(slotName, this.slotsMap, () => ({
			name: slotName
		}))
	}

	public toObject(): ComponentDoc {
		const props = this.getObjectFromDescriptor(this.propsMap)
		const methods = this.getObjectFromDescriptor(this.methodsMap)
		const events = this.getObjectFromDescriptor(this.eventsMap)
		const slots = this.getObjectFromDescriptor(this.slotsMap)

		const obj: { [key: string]: any } = {}
		this.dataMap.forEach((value, key) => {
			if (key) {
				obj[key] = value
			}
		})

		if (this.docsBlocks) {
			obj.docsBlocks = this.docsBlocks
		}

		return {
			...obj,
			// initialize non null params
			description: obj.description || '',
			tags: obj.tags || {},

			// set all the static properties
			exportName: obj.exportName,
			displayName: obj.displayName,
			props,
			events,
			methods,
			slots
		}
	}

	private getDescriptor<T>(name: string, map: Map<string, T>, init: () => T): T {
		let descriptor = map.get(name)
		if (!descriptor) {
			descriptor = init()
			descriptor = { ...descriptor, ...this.originExtendsMixin }
			map.set(name, descriptor)
		}
		return descriptor
	}

	private getObjectFromDescriptor<T>(map: Map<string, T>): T[] | undefined {
		if (map.size > 0) {
			const obj: T[] = []
			map.forEach((descriptor, name) => {
				if (name && descriptor) {
					obj.push(descriptor)
				}
			})
			return obj
		} else {
			return undefined
		}
	}
}
