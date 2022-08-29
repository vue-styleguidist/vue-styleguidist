type BindingTypes = 'data' | 'props' | 'options'
type BindingMetadata = Record<string, BindingTypes>

export interface ImportBinding {
	isType: boolean
	imported: string
	source: string
	isFromSetup: boolean
	isUsedInTemplate: boolean
}

export interface SFCScriptBlock {
	type: 'script'
	content: string
	setup?: string | boolean
	bindings?: BindingMetadata
	imports?: Record<string, ImportBinding>
	/**
	 * import('\@babel/types').Statement
	 */
	scriptAst?: any[]
	/**
	 * import('\@babel/types').Statement
	 */
	scriptSetupAst?: any[]
}

export declare const h: () => void
export declare const createApp: (rootComponent: any) => any
export declare const isVue3: boolean
export declare const Vue2: any
export type App = any
export declare const compileTemplate: (options?: {
	source: string
	filename: string
	id: string
	compilerOptions?: {
		mode?: 'module' | 'function'
		bindingMetadata?: BindingMetadata
		prefixIdentifiers?: boolean
	}
}) => { code: string }

export declare const compileScript: (
	sfc: {
		cssVars: string[]
		script: SFCScriptBlock | null
		scriptSetup: SFCScriptBlock | null
	},
	options?: any
) => SFCScriptBlock
