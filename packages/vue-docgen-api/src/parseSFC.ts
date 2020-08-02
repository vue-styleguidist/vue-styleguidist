import { parse as parseComponent } from '@vue/compiler-sfc'
import * as path from 'path'
import { readFile } from 'fs'
import { promisify } from 'util'
import templateHandlers from './template-handlers'
import cacher from './utils/cacher'
import parseTemplate, { Handler as TemplateHandler } from './parse-template'
import Documentation from './Documentation'
import { ParseOptions } from './parse'
import parseScript from './parse-script'
import defaultScriptHandlers, { preHandlers } from './script-handlers'

const read = promisify(readFile)

export default async function parseSFC(
	initialDoc: Documentation | undefined,
	source: string,
	opt: ParseOptions
): Promise<Documentation[]> {
	let documentation = initialDoc

	// use padding so that errors are displayed at the correct line
	const { descriptor: parts } = cacher(() => parseComponent(source, { pad: 'line' }), source)

	// get slots and props from template
	if (parts.template) {
		const extTemplSrc = parts?.template?.attrs?.src

		const extTemplSource =
			extTemplSrc && typeof extTemplSrc === 'string' && extTemplSrc.length
				? await read(path.resolve(path.dirname(opt.filePath), extTemplSrc), {
						encoding: 'utf-8'
				  })
				: // if we don't have a content to the binding, use empty string
				  ''

		if (extTemplSource.length) {
			parts.template.content = extTemplSource
		}
		const addTemplateHandlers: TemplateHandler[] = opt.addTemplateHandlers || []

		documentation = initialDoc || new Documentation(opt.filePath)

		parseTemplate(parts.template, documentation, [...templateHandlers, ...addTemplateHandlers], opt)
	}

	const extSrc = (parts && parts.script && parts.script.attrs
		? parts.script.attrs.src
		: '') as string
	const extSource =
		extSrc && extSrc.length
			? await read(path.resolve(path.dirname(opt.filePath), extSrc), {
					encoding: 'utf-8'
			  })
			: ''

	let scriptSource = extSource.length ? extSource : parts.script ? parts.script.content : undefined
	opt.lang =
		(parts.script && parts.script.attrs && parts.script.attrs.lang === 'ts') ||
		/\.tsx?$/i.test(extSrc)
			? 'ts'
			: 'js'

	if (parts.customBlocks) {
		documentation = documentation || new Documentation(opt.filePath)

		const docsBlocks = parts.customBlocks
			.filter(block => block.type === 'docs' && block.content && block.content.length)
			.map(block => block.content.trim())

		if (docsBlocks.length) {
			documentation.setDocsBlocks(docsBlocks)
		}
	}

	const scriptHandlers = opt.scriptHandlers || [
		...defaultScriptHandlers,
		...(opt.addScriptHandlers || [])
	]

	const docs: Documentation[] = scriptSource
		? (await parseScript(
				scriptSource,
				opt.scriptPreHandlers || preHandlers,
				scriptHandlers,
				opt,
				documentation,
				initialDoc !== undefined
		  )) || []
		: // if there is only a template return the template's doc
		documentation
		? [documentation]
		: []

	if (documentation && !documentation.get('displayName')) {
		// a component should always have a display name
		// give a component a display name if we can
		const displayName = path.basename(opt.filePath).replace(/\.\w+$/, '')
		const dirName = path.basename(path.dirname(opt.filePath))
		documentation.set('displayName', displayName.toLowerCase() === 'index' ? dirName : displayName)
	}

	return docs
}
