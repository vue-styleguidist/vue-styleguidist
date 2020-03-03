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
import documentRequiredComponents from './utils/documentRequiredComponents'

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
	documentation?: Documentation,
	forceSingleExport: boolean = false
): Promise<Documentation[] | undefined> {
	const plugins: ParserPlugin[] = options.lang === 'ts' ? ['typescript'] : ['flow']
	if (options.jsx) {
		plugins.push('jsx')
	}

	const ast = cacher(() => recast.parse(source, { parser: buildParser({ plugins }) }), source)
	if (!ast) {
		throw new Error(`Unable to parse empty file "${options.filePath}"`)
	}

	const [componentDefinitions, ievSet] = resolveExportedComponent(ast)

	if (componentDefinitions.size === 0) {
		// if there is any immediately exported variable
		// resolve their documentations
		const docs = await documentRequiredComponents(documentation, ievSet, undefined, options)

		// if we do not find any compoents throw
		if (!docs.length) {
			throw new Error(`${ERROR_MISSING_DEFINITION} on "${options.filePath}"`)
		} else {
			return docs
		}
	}

	return executeHandlers(
		preHandlers,
		handlers,
		componentDefinitions,
		documentation,
		ast,
		options,
		forceSingleExport
	)
}

async function executeHandlers(
	preHandlers: Handler[],
	localHandlers: Handler[],
	componentDefinitions: Map<string, NodePath>,
	documentation: Documentation | undefined,
	ast: bt.File,
	opt: ParseOptions,
	forceSingleExport: boolean
): Promise<Documentation[] | undefined> {
	const compDefs = componentDefinitions
		.keys()
		.filter(name => name && (!opt.nameFilter || opt.nameFilter.indexOf(name) > -1))

	if (forceSingleExport && compDefs.length > 1) {
		throw 'vue-docgen-api: multiple exports in a component file are not handled by docgen.parse, Please use "docgen.parseMulti" instead'
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

	// default component first so in multiple exports in parse it is returned
	return docs.sort(
		(a, b) => (a.get('exportName') === 'default' ? -1 : b.get('exportName') === 'default' ? 1 : 0)
	)
}
