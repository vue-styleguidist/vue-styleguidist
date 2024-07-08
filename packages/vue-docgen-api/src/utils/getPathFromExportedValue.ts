import { readFile } from 'fs'
import { promisify } from 'util'
import { NodePath } from 'ast-types/lib/node-path'
import { ParserPlugin } from '@babel/parser'
import { parse, visit } from 'recast'
import buildParser from '../babel-parser'
import cacher from './cacher'
import type { ParseOptions } from '../types'

const read = promisify(readFile)

export default async function getPathOfExportedValue(
	pathResolver: (path: string, originalDirNameOverride?: string) => string | null,
	exportName: string,
	filePath: string[],
	options: ParseOptions
): Promise<NodePath | undefined> {
	const plugins: ParserPlugin[] = options.lang === 'ts' ? ['typescript'] : ['flow']
	if (options.jsx) {
		plugins.push('jsx')
	}
	let filePathIndex = filePath.length
	let exportedPath: NodePath | undefined = undefined
	while (filePathIndex--) {
		const currentFilePath = pathResolver(filePath[filePathIndex])
		if (!currentFilePath) {
			return undefined
		}

		let filePlugins = plugins
		// Fixes SFCs written in JS having their imported modules being assumed to also be JS
		if (/.tsx?$/.test(currentFilePath)) {
			filePlugins = filePlugins.map(plugin => (plugin === 'flow' ? 'typescript' : plugin))
		}

		const source = await read(currentFilePath, {
			encoding: 'utf-8'
		})
		const ast = cacher(
			() => parse(source, { parser: buildParser({ plugins: filePlugins }) }),
			source
		)

		visit(ast, {
			visitExportNamedDeclaration(p) {
				const masterDeclaration = p.node.declaration
				if (masterDeclaration?.type === 'VariableDeclaration') {
					masterDeclaration.declarations.forEach((declaration, i) => {
						if (
							declaration.type === 'VariableDeclarator' &&
							declaration.id.type === 'Identifier' &&
							declaration.id.name === exportName
						) {
							exportedPath = p.get('declaration', 'declarations', i, 'init')
						}
					})
				}
				return false
			},
			visitExportDefaultDeclaration(p) {
				if (exportName === 'default') {
					const masterDeclaration = p.node.declaration
					if (masterDeclaration) {
						exportedPath = p.get('declaration')
					}
				}
				return false
			}
		})
		if (exportedPath) {
			return exportedPath
		}
	}

	return undefined
}
