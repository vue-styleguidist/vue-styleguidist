import Documentation, {
	ComponentDoc,
	BlockTag,
	PropDescriptor,
	SlotDescriptor,
	EventDescriptor,
	MethodDescriptor,
	Param,
	Tag,
	ParamTag
} from './Documentation'
import { DocGenOptions, parseFile, ParseOptions, parseSource as parseSourceLocal } from './parse'

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
	Param,
	Tag,
	ParamTag
}

/**
 * Parse the components at filePath and return props, public methods, events and slots
 * @param filePath absolute path of the parsed file
 * @param opts
 */
export async function parse(
	filePath: string,
	opts?: DocGenOptions | { [alias: string]: string }
): Promise<ComponentDoc> {
	return parsePrimitive(async (doc, options) => await parseFile(doc, options), filePath, opts)
}

/**
 * Parse the `source` assuming that it is located at `filePath` and return props, public methods, events and slots
 * @param filePath absolute path of the parsed file
 * @param opts
 */
export async function parseSource(
	source: string,
	filePath: string,
	opts?: DocGenOptions | { [alias: string]: string }
): Promise<ComponentDoc> {
	return parsePrimitive(
		async (doc, options) => await parseSourceLocal(doc, source, options),
		filePath,
		opts
	)
}

function isOptionsObject(opts: any): opts is DocGenOptions {
	return !!opts && (!!opts.alias || opts.jsx !== undefined || !!opts.addScriptHandlers || !!opts.addTemplateHandlers)
}

async function parsePrimitive(
	createDoc: (doc: Documentation, opts: ParseOptions) => Promise<void>,
	filePath: string,
	opts?: DocGenOptions | { [alias: string]: string }
): Promise<ComponentDoc> {
	const doc = new Documentation()
	const options: ParseOptions = isOptionsObject(opts)
		? { ...opts, filePath }
		: { filePath, alias: opts }
	await createDoc(doc, options)
	return doc.toObject()
}
