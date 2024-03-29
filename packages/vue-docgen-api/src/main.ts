import Documentation, {
	ComponentDoc,
	PropDescriptor,
	SlotDescriptor,
	EventDescriptor,
	MethodDescriptor,
	ExposeDescriptor,
	BlockTag,
	Param,
	Tag,
	ParamTag,
	ParamType
} from './Documentation'
import { parseFile, parseSource as _parseSource } from './parse'
import type { ParseOptions, DocGenOptions } from './types'
import * as ScriptHandlers from './script-handlers'
import * as TemplateHandlers from './template-handlers'

import getDoclets from './utils/getDoclets';
import getProperties from './script-handlers/utils/getProperties';
import getDocblock from './utils/getDocblock';

export { ScriptHandlers }
export { TemplateHandlers }
export { getDoclets }
export { getProperties }
export { getDocblock }
export { TemplateParserOptions } from './parse-template'
export { ScriptHandler, TemplateHandler } from './parse'
export {
	ComponentDoc,
	DocGenOptions,
	ParseOptions,
	Documentation,
	BlockTag,
	PropDescriptor,
	SlotDescriptor,
	EventDescriptor,
	MethodDescriptor,
	ExposeDescriptor,
	Param,
	Tag,
	ParamTag,
	ParamType
}
export { cleanName, getDefaultExample } from 'vue-inbrowser-compiler-independent-utils'

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
		(!!opts.alias ||
			opts.jsx !== undefined ||
			!!opts.addScriptHandlers ||
			!!opts.addTemplateHandlers ||
			!!opts.validExtends ||
			!!opts.nameFilter)
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
	return docs.map(d => d.toObject())
}
