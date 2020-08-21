import Map from 'ts-map'
import {
	Descriptor,
	PropDescriptor,
	MethodDescriptor,
	SlotDescriptor,
	EventDescriptor,
	ComponentDoc,
	DocBlockTags,
	BlockTag,
	Param,
	UnnamedParam,
	Tag,
	ParamTag,
	ParamType
} from 'vue-inbrowser-compiler-utils'

export {
	Descriptor,
	PropDescriptor,
	MethodDescriptor,
	SlotDescriptor,
	EventDescriptor,
	ComponentDoc,
	DocBlockTags,
	BlockTag,
	Param,
	UnnamedParam,
	Tag,
	ParamTag,
	ParamType
}

export default class Documentation {
	private propsMap: Map<string, PropDescriptor>
	private methodsMap: Map<string, MethodDescriptor>
	private slotsMap: Map<string, SlotDescriptor>
	private eventsMap: Map<string, any>
	private dataMap: Map<string, any>
	private docsBlocks: string[] | undefined
	private originExtendsMixin: Descriptor
	public readonly componentFullfilePath: string

	public constructor(fullFilePath: string) {
		this.componentFullfilePath = fullFilePath
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
