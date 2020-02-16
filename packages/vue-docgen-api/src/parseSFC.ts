import { parseComponent } from 'vue-template-compiler'
import * as path from 'path'
import { readFile } from 'fs'
import { promisify } from 'util'
import templateHandlers from './template-handlers'
import cacher from './utils/cacher'
import parseTemplate, { Handler as TemplateHandler } from './parse-template'
import Documentation from './Documentation'
import { ParseOptions } from './parse'
import parseScript, { Handler as ScriptHandler } from './parse-script'
import scriptHandlers, { preHandlers } from './script-handlers'

const read = promisify(readFile)

export default async function parseSFC(
	initialDoc: Documentation | undefined,
	source: string,
	opt: ParseOptions
): Promise<Documentation[]> {
	let documentation = initialDoc
	const addScriptHandlers: ScriptHandler[] = opt.addScriptHandlers || []

	// use padding so that errors are displayed at the correct line
	const parts = cacher(() => parseComponent(source, { pad: 'line' }), source)

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

		documentation = initialDoc || new Documentation(opt.filePath)

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

	const docs: Documentation[] = scriptSource
		? (await parseScript(
				scriptSource,
				preHandlers,
				[...scriptHandlers, ...addScriptHandlers],
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
		documentation.set('displayName', path.basename(opt.filePath).replace(/\.\w+$/, ''))
	}

	return docs
}
