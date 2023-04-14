import { readFile } from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import type { ParseOptions } from './types'
import Documentation from './Documentation'
import parseScript, { Handler as ScriptHandler } from './parse-script'
import { Handler as TemplateHandler } from './parse-template'

import parseSFC from './parseSFC'

const read = promisify(readFile)

const ERROR_EMPTY_DOCUMENT = 'The passed source is empty'

export { ScriptHandler, TemplateHandler }

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
	try {
		const source = await read(opt.filePath, {
			encoding: 'utf-8'
		})
		return parseSource(source, opt, documentation)
	} catch (e) {
		throw Error(`Could not read file ${opt.filePath}`)
	}
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
		opt.lang = /\.tsx?$/i.test(path.extname(opt.filePath)) ? 'ts' : 'js'

		docs = (await parseScript(source, opt, documentation, documentation !== undefined)) || []

		if (docs.length === 1 && !docs[0].get('displayName')) {
			// give a component a display name if we can
			const displayName = path.basename(opt.filePath).replace(/\.\w+$/, '')
			const dirName = path.basename(path.dirname(opt.filePath))
			docs[0].set('displayName', displayName.toLowerCase() === 'index' ? dirName : displayName)
		}
	}

	if (documentation) {
		documentation.setOrigin({})
	}
	return docs
}
