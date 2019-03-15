import { ComponentDoc, Documentation } from './Documentation'
import { DocGenOptions, parseFile, ParseOptions, parseSource as parseSourceLocal } from './parse'

export { ScriptHandler, TemplateHandler } from './parse'
export { ComponentDoc, DocGenOptions, ParseOptions, Documentation }

/**
 * Parse the components at filePath and return props, public methods, events and slots
 * @param filePath absolute path of the parsed file
 * @param opts
 */
export function parse(
	filePath: string,
	opts?: DocGenOptions | { [alias: string]: string }
): ComponentDoc {
	return parsePrimitive((doc, options) => parseFile(doc, options), filePath, opts)
}

/**
 * Parse the `source` assuming that it is located at `filePath` and return props, public methods, events and slots
 * @param filePath absolute path of the parsed file
 * @param opts
 */
export function parseSource(
	source: string,
	filePath: string,
	opts?: DocGenOptions | { [alias: string]: string }
): ComponentDoc {
	return parsePrimitive((doc, options) => parseSourceLocal(doc, source, options), filePath, opts)
}

function isOptionsObject(opts: any): opts is DocGenOptions {
	return !!opts && !!opts.alias
}

function parsePrimitive(
	createDoc: (doc: Documentation, opts: ParseOptions) => void,
	filePath: string,
	opts?: DocGenOptions | { [alias: string]: string }
): ComponentDoc {
	const doc = new Documentation()
	const options: ParseOptions = isOptionsObject(opts)
		? { ...opts, filePath }
		: { filePath, alias: opts }
	createDoc(doc, options)
	return doc.toObject()
}
