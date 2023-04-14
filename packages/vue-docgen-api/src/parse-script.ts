import { ParserPlugin } from '@babel/parser'
import { parse } from 'recast'
import buildParser from './babel-parser'
import Documentation from './Documentation'
import type { ParseFileFunction, ParseOptions } from './types'
import cacher from './utils/cacher'
import resolveExportedComponent from './utils/resolveExportedComponent'
import documentRequiredComponents from './utils/documentRequiredComponents'
import { addDefaultAndExecuteHandlers } from './utils/execute-handlers'

const ERROR_MISSING_DEFINITION = 'No suitable component definition found'

export default async function parseScript(
  parseFile: ParseFileFunction,
	source: string,
	options: ParseOptions,
	documentation?: Documentation,
	forceSingleExport = false,
	noNeedForExport = false
): Promise<Documentation[] | undefined> {
	const plugins: ParserPlugin[] = options.lang === 'ts' ? ['typescript'] : ['flow']
	if (options.jsx) {
		plugins.push('jsx')
	}

	const ast = cacher(() => parse(source, { parser: buildParser({ plugins }) }), source)
	if (!ast) {
		throw new Error(`Unable to parse empty file "${options.filePath}"`)
	}

	const [componentDefinitions, ievSet] = resolveExportedComponent(ast)

	if (componentDefinitions.size === 0 && noNeedForExport) {
		componentDefinitions.set('default', ast.program.body[0])
	}

	if (componentDefinitions.size === 0) {
		// if there is any immediately exported variable
		// resolve their documentations
		const docs = await documentRequiredComponents(parseFile, documentation, ievSet, undefined, options)

		// if we do not find any components, throw
		if (!docs.length) {
			throw new Error(`${ERROR_MISSING_DEFINITION} on "${options.filePath}"`)
		} else {
			return docs
		}
	}

	return addDefaultAndExecuteHandlers(
		componentDefinitions,
		ast,
		options,
    {
      parseFile,
    },
		documentation,
		forceSingleExport
	)
}
