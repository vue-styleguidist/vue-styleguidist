import { readFile } from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import Documentation, { Descriptor } from './Documentation'
import parseScript, { Handler as ScriptHandler } from './parse-script'
import { Handler as TemplateHandler } from './parse-template'

import scriptHandlers, { preHandlers } from './script-handlers'
import parseSFC from './parseSFC'

const read = promisify(readFile)

const ERROR_EMPTY_DOCUMENT = 'The passed source is empty'

export { ScriptHandler, TemplateHandler }

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
	alias?: { [alias: string]: string }
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
	 * Does parsed components use jsx?
	 * @default true - if you do not disable it, babel will fail with `(<any>window).$`
	 */
	jsx?: boolean
	/**
	 * Should extended components be parsed?
	 * @default `fullFilePath=>!/[\\/]node_modules[\\/]/.test(fullFilePath)`
	 */
	validExtends?: (fullFilePath: string) => boolean
}

/**
 * parses the source at filePath and returns the doc
 * @param opt ParseOptions containing the filePath and the rest of the options
 * @param documentation documentation to be enriched if needed
 * @returns {object} documentation object
 */
export async function parseFile(
	opt: ParseOptions,
	documentation?: Documentation
): Promise<Documentation[]> {
	const source = await read(opt.filePath, {
		encoding: 'utf-8'
	})
	return parseSource(source, opt, documentation)
}

/**
 * parses the source and returns the doc
 * @param {string} source code whose documentation is parsed
 * @param {string} opt path of the current file against whom to resolve the mixins
 * @returns {object} documentation object
 */
export async function parseSource(
	source: string,
	opt: ParseOptions,
	documentation?: Documentation
): Promise<Documentation[]> {
	// if jsx option is not mentionned, parse jsx in components
	opt.jsx = opt.jsx === undefined ? true : opt.jsx

	const singleFileComponent = /\.vue$/i.test(path.extname(opt.filePath))

	if (source === '') {
		throw new Error(ERROR_EMPTY_DOCUMENT)
	}

	// if the parsed component is the result of a mixin or an extends
	if (documentation) {
		documentation.setOrigin(opt)
	}

	let docs: Documentation[]
	if (singleFileComponent) {
		docs = await parseSFC(documentation, source, opt)
	} else {
		const addScriptHandlers: ScriptHandler[] = opt.addScriptHandlers || []
		opt.lang = /\.tsx?$/i.test(path.extname(opt.filePath)) ? 'ts' : 'js'

		docs =
			(await parseScript(
				source,
				preHandlers,
				[...scriptHandlers, ...addScriptHandlers],
				opt,
				documentation,
				documentation !== undefined
			)) || []

		if (docs.length === 1 && !docs[0].get('displayName')) {
			// give a component a display name if we can
			docs[0].set('displayName', path.basename(opt.filePath).replace(/\.\w+$/, ''))
		}
	}

	if (documentation) {
		documentation.setOrigin({})
	}
	return docs
}
