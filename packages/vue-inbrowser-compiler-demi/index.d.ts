import { VueConstructor } from 'vue'

type BindingTypes = 'data' | 'props' | 'options'

export declare const h: () => void
export declare const createApp: () => void
export declare const resolveComponent: (name: object | string) => string | object
export declare const isVue3: boolean
export declare const Vue2: VueConstructor
export declare const compileTemplate: (
	template: string,
	options?: { bindingMetadata: Record<string, BindingTypes> }
) => string
