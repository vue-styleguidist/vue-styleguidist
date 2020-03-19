export { cleanName, getDefaultExample } from 'vue-inbrowser-compiler-utils'

import Documentation, {
	ComponentDoc,
	PropDescriptor,
	SlotDescriptor,
	EventDescriptor,
	MethodDescriptor,
	BlockTag,
	Param,
	Tag,
	ParamTag,
	ParamType
} from './Documentation'
import { DocGenOptions as DCOptions, parseFile, ParseOptions, parseSource as _parseSource } from './parse'
import * as ScriptHandlers from './script-handlers'
import * as TemplateHandlers from './template-handlers'

export { ScriptHandlers }
export { TemplateHandlers }
import mergeTranslations from './mergeTranslations'

export interface DocGenOptions extends DCOptions {
	translations?: string
}

export { TemplateParserOptions } from './parse-template'
export { ScriptHandler, TemplateHandler } from './parse'
export {
	ComponentDoc,
	ParseOptions,
	Documentation,
	BlockTag,
	PropDescriptor,
	SlotDescriptor,
	EventDescriptor,
	MethodDescriptor,
	Param,
	Tag,
	ParamTag,
	ParamType
}


/**
 * Parse the component at filePath and return props, public methods, events and slots
 * @param filePath absolute path of the parsed file
 * @param opts
 */
export async function parse(
	filePath: string,
	opts?: DocGenOptions | { [alias: string]: string }
): Promise<ComponentDoc> {
	return (await parsePrimitive(async options => await parseFile(options), filePath, opts))[0]
}

/**
 * Parse all the components at filePath and returns an array of their
 * props, public methods, events and slot
 * @param filePath absolute path of the parsed file
 * @param opts
 */
export function parseMulti(filePath: string, opts?: DocGenOptions): Promise<ComponentDoc[]> {
	return parsePrimitive(async options => await parseFile(options), filePath, opts)
}

/**
 * Parse the `source` assuming that it is located at `filePath` and return props, public methods, events and slots
 * @param source source code to be parsed
 * @param filePath absolute path of the parsed file
 * @param opts
 */
export async function parseSource(
	source: string,
	filePath: string,
	opts?: DocGenOptions | { [alias: string]: string }
): Promise<ComponentDoc> {
	return (
		await parsePrimitive(async options => await _parseSource(source, options), filePath, opts)
	)[0]
}

function isOptionsObject(opts: any): opts is DocGenOptions {
	return (
		!!opts &&
		(opts.jsx !== undefined ||
			!!opts.alias ||
			!!opts.validExtends ||
			!!opts.addScriptHandlers ||
			!!opts.addTemplateHandlers)
	)
}

async function parsePrimitive(
	createDocs: (opts: ParseOptions) => Promise<Documentation[]>,
	filePath: string,
	opts?: DocGenOptions | { [alias: string]: string }
): Promise<ComponentDoc[]> {
	const options: ParseOptions = isOptionsObject(opts)
		? {
				validExtends: (fullFilePath: string) => !/[\\/]node_modules[\\/]/.test(fullFilePath),
				...opts,
				filePath
		  }
		: {
				filePath,
				alias: opts,
				validExtends: (fullFilePath: string) => !/[\\/]node_modules[\\/]/.test(fullFilePath)
		  }
	const docs = await createDocs(options)
	return docs
		.map(d => d.toObject())
		.map(d => (opts && opts.translations ? mergeTranslations(d, filePath, opts.translations) : d))
}
