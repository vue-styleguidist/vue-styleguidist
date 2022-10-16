import { parse as parseComponent, SFCScriptBlock } from '@vue/compiler-sfc'
import * as path from 'path'
import { readFile } from 'fs'
import { promisify } from 'util'
import templateHandlers from './template-handlers'
import cacher from './utils/cacher'
import parseTemplate, { Handler as TemplateHandler } from './parse-template'
import Documentation from './Documentation'
import { ParseOptions } from './parse'
import parseScript from './parse-script'
import makePathResolver from './utils/makePathResolver'
import setupHandlers from './script-setup-handlers'

const read = promisify(readFile)

export default async function parseSFC(
	initialDoc: Documentation | undefined,
	source: string,
	opt: ParseOptions
): Promise<Documentation[]> {
	let documentation = initialDoc

	// create a custom path resolver to resolve webpack aliases
	const pathResolver = makePathResolver(path.dirname(opt.filePath), opt.alias, opt.modules)

	// use padding so that errors are displayed at the correct line
	const { descriptor: parts } = cacher(() => parseComponent(source, { pad: 'line' }), source)

	// get slots and props from template
	if (parts.template) {
		const extTemplSrc = parts?.template?.attrs?.src

		if (extTemplSrc && typeof extTemplSrc === 'string') {
			const extTemplSrcAbs = pathResolver(extTemplSrc)

			const extTemplSource = extTemplSrcAbs
				? await read(extTemplSrcAbs, {
						encoding: 'utf-8'
				  })
				: // if we don't have a content to bind
				  // leave the template alone
				  false

			if (extTemplSource) {
				parts.template.content = extTemplSource
			}
		}
		const addTemplateHandlers: TemplateHandler[] = opt.addTemplateHandlers || []

		documentation = initialDoc || new Documentation(opt.filePath)

		parseTemplate(parts.template, documentation, [...templateHandlers, ...addTemplateHandlers], opt)
	}

	if (parts.customBlocks) {
		documentation = documentation || new Documentation(opt.filePath)

		const docsBlocks = parts.customBlocks
			.filter(block => block.type === 'docs' && block.content && block.content.length)
			.map(block => block.content.trim())

		if (docsBlocks.length) {
			documentation.setDocsBlocks(docsBlocks)
		}
	}

	let docs: Documentation[] = documentation ? [documentation] : []

	if (parts.scriptSetup) {
		docs = await parseScriptTag(
			parts.scriptSetup,
			pathResolver,
			opt,
			documentation,
			initialDoc !== undefined,
			true,
			parts.script ? parts.script.content : ''
		)
	} else if (parts.script) {
		docs = await parseScriptTag(
			parts.script,
			pathResolver,
			opt,
			documentation,
			initialDoc !== undefined
		)
	}

	if (documentation && !documentation.get('displayName')) {
		// a component should always have a display name
		// give a component a display name if we can
		const displayName = path.basename(opt.filePath).replace(/\.\w+$/, '')
		const dirName = path.basename(path.dirname(opt.filePath))
		documentation.set('displayName', displayName.toLowerCase() === 'index' ? dirName : displayName)
	}

	return docs
}

async function parseScriptTag(
	scriptTag: SFCScriptBlock,
	pathResolver: (filePath: string, overrideRoot?: string) => string | null,
	opt: ParseOptions,
	documentation: Documentation | undefined,
	forceSingleExport: boolean,
	isSetupScript: boolean = false,
	isSetupScriptOtherScript: string = ''
): Promise<Documentation[]> {
	let scriptSource = scriptTag ? scriptTag.content : undefined

	const extSrc = scriptTag && scriptTag.attrs ? scriptTag.attrs.src : false

	if (extSrc && typeof extSrc === 'string') {
		const extSrcAbs = pathResolver(extSrc)

		const extSource = extSrcAbs
			? await read(extSrcAbs, {
					encoding: 'utf-8'
			  })
			: ''
		if (extSource.length) {
			scriptSource = extSource
			opt.lang =
				(scriptTag && scriptTag.attrs && /^tsx?$/.test(scriptTag.attrs.lang as string)) ||
				/\.tsx?$/i.test(extSrc)
					? 'ts'
					: 'js'
		}
	}

	opt.lang =
		(scriptTag && scriptTag.attrs && /^tsx?$/.test(scriptTag.attrs.lang as string)) ||
		(typeof extSrc === 'string' && /\.tsx?$/i.test(extSrc))
			? 'ts'
			: 'js'

	opt = isSetupScript ? { ...opt, scriptPreHandlers: [], scriptHandlers: setupHandlers } : opt

	const docs: Documentation[] = scriptSource
		? (await parseScript(
				isSetupScriptOtherScript + '\n' + scriptSource,
				opt,
				documentation,
				forceSingleExport,
				isSetupScript
		  )) || []
		: // if there is only a template return the template's doc
		documentation
		? [documentation]
		: []

	return docs
}
