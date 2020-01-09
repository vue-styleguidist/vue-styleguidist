import { ParserPlugin } from '@babel/parser'
import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import recast from 'recast'
import Map from 'ts-map'
import buildParser from './babel-parser'
import Documentation from './Documentation'
import { ParseOptions } from './parse'
import cacher from './utils/cacher'
import resolveExportedComponent from './utils/resolveExportedComponent'

const ERROR_MISSING_DEFINITION = 'No suitable component definition found'

export type Handler = (
	doc: Documentation,
	componentDefinition: NodePath,
	ast: bt.File,
	opt: ParseOptions
) => Promise<void>

export default async function parseScript(
	source: string,
	preHandlers: Handler[],
	handlers: Handler[],
	options: ParseOptions,
	documentation?: Documentation
): Promise<Documentation[] | undefined> {
	const plugins: ParserPlugin[] = options.lang === 'ts' ? ['typescript'] : ['flow']
	if (options.jsx) {
		plugins.push('jsx')
	}

	const ast = cacher(() => recast.parse(source, { parser: buildParser({ plugins }) }), source)
	if (!ast) {
		throw new Error(`${ERROR_MISSING_DEFINITION} on "${options.filePath}"`)
	}

	const componentDefinitions = resolveExportedComponent(ast)

	if (componentDefinitions.size === 0) {
		throw new Error(`${ERROR_MISSING_DEFINITION} on "${options.filePath}"`)
	}

	return await executeHandlers(
		preHandlers,
		handlers,
		componentDefinitions,
		documentation,
		ast,
		options
	)
}

async function executeHandlers(
	preHandlers: Handler[],
	localHandlers: Handler[],
	componentDefinitions: Map<string, NodePath>,
	documentation: Documentation | undefined,
	ast: bt.File,
	opt: ParseOptions
): Promise<Documentation[] | undefined> {
	const compDefs = componentDefinitions
		.keys()
		.filter(name => name && (!opt.nameFilter || opt.nameFilter.indexOf(name) > -1))

	if (documentation && compDefs.length > 1) {
		throw 'vue-docgen-api: multiple exports in a component file are not handled by docgen.parse, Please use "docgen.parseMulti" instead'
	}

	return await Promise.all(
		compDefs.map(async name => {
			const doc = documentation || new Documentation()
			const compDef = componentDefinitions.get(name) as NodePath
			// execute all prehandlers in order
			await preHandlers.reduce(async (_, handler) => {
				await _
				return await handler(doc, compDef, ast, opt)
			}, Promise.resolve())
			await Promise.all(localHandlers.map(async handler => await handler(doc, compDef, ast, opt)))
			// end with setting of exportname
			// to avoid dependencies names bleeding on the main components,
			// do this step at the end of the function
			doc.set('exportName', name)
			return doc
		})
	)
}
