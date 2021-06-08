import * as bt from '@babel/types'
import Map from 'ts-map'
import { visit } from 'recast'
import { NodePath } from 'ast-types/lib/node-path'

function ignore(): boolean {
	return false
}

export default function resolveLocal(ast: bt.File, variableNames: string[]): Map<string, NodePath> {
	const variablesMap = new Map<string, NodePath>()
	visit(ast, {
		// for perf resons,
		// look only at the root,
		// ignore all traversing except for if
		visitFunctionDeclaration: ignore,
		visitFunctionExpression: ignore,
		visitClassDeclaration: ignore,
		visitClassExpression: ignore,
		visitWithStatement: ignore,
		visitSwitchStatement: ignore,
		visitWhileStatement: ignore,
		visitDoWhileStatement: ignore,
		visitForStatement: ignore,
		visitForInStatement: ignore,
		visitVariableDeclaration(pathVariable) {
			pathVariable.get('declarations').each((declaration: NodePath) => {
				if (bt.isVariableDeclarator(declaration.node) && bt.isIdentifier(declaration.node.id)) {
					const varName: string = declaration.node.id.name
					if (variableNames.includes(varName)) {
						variablesMap.set(varName, declaration.get('init'))
					}
				}
			})
			return false
		}
	})
	return variablesMap
}
