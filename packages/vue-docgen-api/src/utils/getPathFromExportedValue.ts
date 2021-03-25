import { readFile } from 'fs'
import { promisify } from 'util'
import { NodePath } from 'ast-types/lib/node-path'
import { visit } from 'ast-types'
import * as bt from '@babel/types'
import { ParserPlugin } from '@babel/parser'
import { parse } from 'recast'
import buildParser from '../babel-parser'
import cacher from './cacher'
import { ParseOptions } from '../parse'

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
		const source = await read(currentFilePath, {
			encoding: 'utf-8'
		})
		const ast = cacher(() => parse(source, { parser: buildParser({ plugins }) }), source)

		visit(ast, {
			visitExportNamedDeclaration(p) {
				const masterDeclaration = p.node.declaration
				if (masterDeclaration && bt.isVariableDeclaration(masterDeclaration)) {
					masterDeclaration.declarations.forEach((declaration, i) => {
						if (
							bt.isVariableDeclarator(declaration) &&
							bt.isIdentifier(declaration.id) &&
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
