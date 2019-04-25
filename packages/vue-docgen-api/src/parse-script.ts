import { ParserPlugin } from '@babel/parser'
import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import recast from 'recast'
import Map from 'ts-map'
import buildParser from './babel-parser'
import { Documentation } from './Documentation'
import { ParseOptions } from './parse'
import cacher from './utils/cacher'
import resolveExportedComponent from './utils/resolveExportedComponent'

const ERROR_MISSING_DEFINITION = 'No suitable component definition found'

export type Handler = (
	doc: Documentation,
	componentDefinition: NodePath,
	ast: bt.File,
	opt: ParseOptions
) => void

export default function parseScript(
	source: string,
	documentation: Documentation,
	handlers: Handler[],
	options: ParseOptions
) {
	const plugins: ParserPlugin[] = options.lang === 'ts' ? ['typescript'] : ['flow']
	if (options.jsx) {
		plugins.push('jsx')
	}

	const ast = cacher(() => recast.parse(source, { parser: buildParser({ plugins }) }), source)
	if (!ast) {
		throw new Error(ERROR_MISSING_DEFINITION)
	}

	const componentDefinitions = resolveExportedComponent(ast)

	if (componentDefinitions.size === 0) {
		throw new Error(ERROR_MISSING_DEFINITION)
	}

	executeHandlers(handlers, componentDefinitions, documentation, ast, options)
}

function executeHandlers(
	localHandlers: Handler[],
	componentDefinitions: Map<string, NodePath>,
	documentation: Documentation,
	ast: bt.File,
	opt: ParseOptions
) {
	return componentDefinitions.forEach((compDef, name) => {
		if (compDef && name && (!opt.nameFilter || opt.nameFilter.indexOf(name) > -1)) {
			localHandlers.forEach(handler => handler(documentation, compDef, ast, opt))
		}
	})
}
