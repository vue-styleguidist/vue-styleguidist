import path from 'path'
import * as bt from '@babel/types'
import { parse } from 'recast'
import { ParserPlugin } from '@babel/parser'
import { SpreadElement } from '@babel/types'
import { promisify } from 'util'
import { readFile } from 'fs'
import { NodePath } from 'ast-types/lib/node-path'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import Documentation from '../../Documentation'
import { ParseOptions } from '../../parse'
import cacher from '../../utils/cacher'
import buildParser from '../../babel-parser'

const read = promisify(readFile)

export default async function getSpreadProperties(
	node: SpreadElement,
	opt: ParseOptions,
	documentation: Documentation
): Promise<NodePath<bt.ObjectExpression, any>> {
	const spreadElementName =
		// @ts-ignore
		node.argument.type === 'CallExpression' ? node.argument.callee.name : node.argument.name
	const source = await read(documentation.componentFullfilePath, { encoding: 'utf-8' })
	const spreadImportPaths = getFromPathsInFileByImportsOrExports(source, spreadElementName)
	const composableDirPath = getFullPathToComposableDir(documentation, spreadImportPaths)
	const composableFilePath = await getComposableFilePath(composableDirPath, opt, spreadElementName)

	return parseAstFromComposableFile(composableFilePath, opt)
}

function getFromPathsInFileByImportsOrExports(source: string, query?: string): string[] {
	const regExp = /(import|export)(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s].*([@\w/_-]+)["'\s].*/g
	const imports = source.match(regExp) as string[]
	const fromImportsOrExports = imports
		.filter(item => (query ? item.includes(query) : true))
		.map(item => {
			const importFrom = item.match(/(?<=from).+/)
			if (importFrom) {
				return importFrom[0].replace(' ', '').replaceAll("'", '').replace(';', '')
			}
			return null
		})

	if (!fromImportsOrExports) {
		throw new Error('Not found imports or exports in file')
	}

	return fromImportsOrExports as string[]
}

function getFullPathToComposableDir(documentation: Documentation, paths: string[]): string {
	const importPath = paths.toString().split(path.sep)
	const componentPath = documentation.componentFullfilePath.split(path.sep)
	const prependPath = componentPath
		.slice(0, componentPath.length - importPath.filter(i => i === '..').length - 1)
		.join(path.sep)
	return path.join(prependPath, importPath.filter(i => i !== '..').join(path.sep))
}

async function getComposableFilePath(
	dirPath: string,
	opt: ParseOptions,
	spreadElementName: string
): Promise<string> {
	try {
		const indexFile = await read(path.join(dirPath, `index.${opt.lang}`), { encoding: 'utf-8' })
		const paths = getFromPathsInFileByImportsOrExports(indexFile)

		let composableFileName = ''
		for (let fileName of paths) {
			if (fileName) {
				fileName = `${fileName.replace(`.${path.sep}`, '')}.${opt.lang}`

				const composableFile = await read(path.join(dirPath, fileName), { encoding: 'utf-8' })
				if (composableFile.includes(spreadElementName)) {
					composableFileName = fileName
				}
			}
		}

		return path.join(dirPath, composableFileName)
	} catch (e) {
		const singleFilePath = path.join(`${dirPath}.${opt.lang}`)

		try {
			const composableFile = await read(path.join(singleFilePath), { encoding: 'utf-8' })
			if (composableFile.includes(spreadElementName)) {
				return singleFilePath
			}
		} catch (e) {
			throw new Error(`Could not read file ${singleFilePath}`)
		}

		throw new Error(`Could not read file ${dirPath}`)
	}
}

async function parseAstFromComposableFile(path: string, opt: ParseOptions) {
	try {
		const plugins: ParserPlugin[] = opt.lang === 'ts' ? ['typescript'] : ['flow']

		if (opt.jsx) {
			plugins.push('jsx')
		}

		const composableFile = await read(path, {
			encoding: 'utf-8'
		})

		const ast = cacher(
			() => parse(composableFile, { parser: buildParser({ plugins }) }),
			composableFile
		)
		if (!ast) {
			throw new Error(`Unable to parse empty file "${path}"`)
		}

		const [componentDefinitions] = resolveExportedComponent(ast)

		// @ts-ignore
		return componentDefinitions.valueStore[0]
	} catch (e) {
		throw new Error(`Could not read file ${path}`)
	}
}
