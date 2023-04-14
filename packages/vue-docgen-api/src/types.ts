import type { Options as PugOptions } from 'pug'
import type { Descriptor } from './Documentation'
import type { Handler as ScriptHandler } from './parse-script'
import type { Handler as TemplateHandler } from './parse-template'

export interface ParseOptions extends DocGenOptions, Descriptor {
	validExtends: (fullFilePath: string) => boolean
	filePath: string
	/**
	 * In what language is the component written
	 * @default undefined - let the system decide
	 */
	lang?: 'ts' | 'js'
}

export interface DocGenOptions {
	/**
	 * Which exported variables should be looked at
	 * @default undefined - means treat all exports
	 */
	nameFilter?: string[]
	/**
	 * What alias should be replaced in requires and imports
	 */
	alias?: { [alias: string]: string | string[] }
	/**
	 * What directories should be searched when resolving modules
	 */
	modules?: string[]
	/**
	 * Handlers that will be added at the end of the script analysis
	 */
	addScriptHandlers?: ScriptHandler[]
	/**
	 * Handlers that will be added at the end of the template analysis
	 */
	addTemplateHandlers?: TemplateHandler[]
	/**
	 * Handlers that will replace the extend and mixins analyzer
	 * They will be run before the main component analysis to avoid bleeding onto the main
	 */
	scriptPreHandlers?: ScriptHandler[]
	/**
	 * Handlers that will replace the main script analysis
	 */
	scriptHandlers?: ScriptHandler[]
	/**
	 * Handlers that will replace the template analysis
	 */
	templateHandlers?: TemplateHandler[]
	/**
	 * Does parsed components use jsx?
	 * @default true - if you do not disable it, babel will fail with `(<any>window).$`
	 */
	jsx?: boolean
	/**
	 * Should extended components be parsed?
	 * @default `fullFilePath=>!/[\\/]node_modules[\\/]/.test(fullFilePath)`
	 */
	validExtends?: (fullFilePath: string) => boolean
	/**
	 * all pug options passed to the pug compiler if you use it
	 */
	pugOptions?: PugOptions
}