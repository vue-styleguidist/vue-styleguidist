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
	documentation: Documentation,
	preHandlers: Handler[],
	handlers: Handler[],
	options: ParseOptions
) {
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

	await executeHandlers(preHandlers, handlers, componentDefinitions, documentation, ast, options)
}

async function executeHandlers(
	preHandlers: Handler[],
	localHandlers: Handler[],
	componentDefinitions: Map<string, NodePath>,
	documentation: Documentation,
	ast: bt.File,
	opt: ParseOptions
) {
	return await Promise.all(
		componentDefinitions.keys().map(async name => {
			const compDef = componentDefinitions.get(name)
			if (compDef && name && (!opt.nameFilter || opt.nameFilter.indexOf(name) > -1)) {
				// execute all handlers in order as order matters
				await preHandlers.reduce(async (_, handler) => {
					await _
					return await handler(documentation, compDef, ast, opt)
				}, Promise.resolve())
				await Promise.all(
					localHandlers.map(async handler => await handler(documentation, compDef, ast, opt))
				)
			}
		})
	)
}
