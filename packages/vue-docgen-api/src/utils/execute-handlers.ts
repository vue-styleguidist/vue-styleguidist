import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import Map from 'ts-map'
import Documentation from '../Documentation'
import type { HandlerExecutorsFunction, ParseFileFunction, ParseOptions, ScriptHandler } from '../types'
import defaultScriptHandlers, { preHandlers } from '../script-handlers'

export const addDefaultAndExecuteHandlers: HandlerExecutorsFunction = (
	componentDefinitions,
	ast,
	options,
  deps: {
    parseFile: ParseFileFunction,
  },
	documentation,
	forceSingleExport = false
) => {
	const handlers = [
		...(options.scriptHandlers || defaultScriptHandlers),
		...(options.addScriptHandlers || [])
	]

	return executeHandlers(
		options.scriptPreHandlers || preHandlers,
		handlers,
		componentDefinitions,
		ast,
		options,
		forceSingleExport,
    deps,
		documentation
	)
}

async function executeHandlers(
	preHandlers: ScriptHandler[],
	localHandlers: ScriptHandler[],
	componentDefinitions: Map<string, NodePath>,
	ast: bt.File,
	opt: ParseOptions,
	forceSingleExport: boolean,
  deps: {
    parseFile: ParseFileFunction,
  },
	documentation?: Documentation,
): Promise<Documentation[] | undefined> {
	const compDefs = componentDefinitions
		.keys()
		.filter(name => name && (!opt.nameFilter || opt.nameFilter.indexOf(name) > -1))

	if (forceSingleExport && compDefs.length > 1) {
		throw Error(
			'vue-docgen-api: multiple exports in a component file are not handled by docgen.parse, Please use "docgen.parseMulti" instead'
		)
	}

	const docs = await Promise.all(
		compDefs.map(async name => {
			// If there are multiple exports and an initial documentation,
			// it means the doc is coming from an SFC template.
			// Only enrich the doc attached to the default export
			// NOTE: module.exports is normalized to default
			const doc =
				(compDefs.length > 1 && name !== 'default' ? undefined : documentation) ||
				new Documentation(opt.filePath)
			const compDef = componentDefinitions.get(name) as NodePath
			// execute all prehandlers in order
			await preHandlers.reduce(async (_, handler) => {
				await _
				if (typeof handler === 'function') {
					return await handler(doc, compDef, ast, opt, {parseFile:deps.parseFile, addDefaultAndExecuteHandlers})
				}
			}, Promise.resolve())
			await Promise.all(localHandlers.map(async handler => await handler(doc, compDef, ast, opt, {parseFile:deps.parseFile, addDefaultAndExecuteHandlers})))
			// end with setting of exportname
			// to avoid dependencies names bleeding on the main components,
			// do this step at the end of the function
			doc.set('exportName', name)
			return doc
		})
	)

	// default component first so in multiple exports in parse it is returned
	return docs.sort((a, b) =>
		a.get('exportName') === 'default' ? -1 : b.get('exportName') === 'default' ? 1 : 0
	)
}
