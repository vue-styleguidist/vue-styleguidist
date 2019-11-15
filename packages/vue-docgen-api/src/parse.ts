import { readFile } from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import { parseComponent } from 'vue-template-compiler'
import Documentation, { Descriptor } from './Documentation'
import parseScript, { Handler as ScriptHandler } from './parse-script'
import parseTemplate, { Handler as TemplateHandler } from './parse-template'
import scriptHandlers, { preHandlers } from './script-handlers'
import templateHandlers from './template-handlers'
import cacher from './utils/cacher'

const read = promisify(readFile)

const ERROR_EMPTY_DOCUMENT = 'The passed source is empty'

export { ScriptHandler, TemplateHandler }

export interface ParseOptions extends DocGenOptions, Descriptor {
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
	 * @default undefined - means treat all dependencies
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
}

/**
 * parses the source and returns the doc
 * @param {string} source code whose documentation is parsed
 * @param {string} filePath path of the current file against whom to resolve the mixins
 * @returns {object} documentation object
 */
export async function parseFile(documentation: Documentation, opt: ParseOptions) {
	const source = await read(opt.filePath, {
		encoding: 'utf-8'
	})
	return parseSource(documentation, source, opt)
}

/**
 * parses the source and returns the doc
 * @param {string} source code whose documentation is parsed
 * @param {string} filePath path of the current file against whom to resolve the mixins
 * @returns {object} documentation object
 */
export async function parseSource(documentation: Documentation, source: string, opt: ParseOptions) {
	// if the parsed component is the result of a mixin or an extends
	documentation.setOrigin(opt)
	const singleFileComponent = /\.vue$/i.test(path.extname(opt.filePath))
	let scriptSource: string | undefined

	if (source === '') {
		throw new Error(ERROR_EMPTY_DOCUMENT)
	}

	if (singleFileComponent) {
		// use padding so that errors are displayed at the correct line
		const parts = cacher(() => parseComponent(source, { pad: 'line' }), source)

		if (parts.customBlocks) {
			const docsBlocks = parts.customBlocks
				.filter(block => block.type === 'docs' && block.content && block.content.length)
				.map(block => block.content.trim())

			if (docsBlocks.length) {
				documentation.setDocsBlocks(docsBlocks)
			}
		}

		// get slots and props from template
		if (parts.template) {
			const extTemplSrc: string =
				parts && parts.template && parts.template.attrs ? parts.template.attrs.src : ''
			const extTemplSource =
				extTemplSrc && extTemplSrc.length
					? await read(path.resolve(path.dirname(opt.filePath), extTemplSrc), {
							encoding: 'utf-8'
					  })
					: ''
			if (extTemplSource.length) {
				parts.template.content = extTemplSource
			}
			const addTemplateHandlers: TemplateHandler[] = opt.addTemplateHandlers || []
			parseTemplate(
				parts.template,
				documentation,
				[...templateHandlers, ...addTemplateHandlers],
				opt.filePath
			)
		}

		const extSrc: string = parts && parts.script && parts.script.attrs ? parts.script.attrs.src : ''
		const extSource =
			extSrc && extSrc.length
				? await read(path.resolve(path.dirname(opt.filePath), extSrc), {
						encoding: 'utf-8'
				  })
				: ''

		scriptSource = extSource.length ? extSource : parts.script ? parts.script.content : undefined
		opt.lang =
			(parts.script && parts.script.attrs && parts.script.attrs.lang === 'ts') ||
			/\.tsx?$/i.test(extSrc)
				? 'ts'
				: 'js'
	} else {
		scriptSource = source
		opt.lang = /\.tsx?$/i.test(path.extname(opt.filePath)) ? 'ts' : 'js'
	}

	if (scriptSource) {
		// if jsx option is not mentionned, parse jsx in components
		opt.jsx = opt.jsx === undefined ? true : opt.jsx

		const addScriptHandlers: ScriptHandler[] = opt.addScriptHandlers || []
		if (scriptSource) {
			await parseScript(
				scriptSource,
				documentation,
				preHandlers,
				[...scriptHandlers, ...addScriptHandlers],
				opt
			)
		}
	}

	if (!documentation.get('displayName')) {
		// a component should always have a display name
		documentation.set('displayName', path.basename(opt.filePath).replace(/\.\w+$/, ''))
	}
}
