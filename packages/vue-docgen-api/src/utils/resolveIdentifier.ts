import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import { visit } from 'recast'

function ignore(): boolean {
	return false
}

export default function resolveIdentifier(ast: bt.File, path: NodePath): NodePath | null {
	if (!bt.isIdentifier(path.node)) {
		return path
	}

	const varName = path.node.name
	let comp: NodePath | null = null

	visit(ast.program, {
		// to look only at the root we ignore all traversing
		visitFunctionDeclaration: ignore,
		visitFunctionExpression: ignore,
		visitClassExpression: ignore,
		visitIfStatement: ignore,
		visitWithStatement: ignore,
		visitSwitchStatement: ignore,
		visitWhileStatement: ignore,
		visitDoWhileStatement: ignore,
		visitForStatement: ignore,
		visitForInStatement: ignore,

		visitVariableDeclaration(variablePath) {
			if (variablePath.node.type !== 'VariableDeclaration') {
				return false
			}
			const firstDeclaration = variablePath.node.declarations[0]
			const varID =
				firstDeclaration.type === 'VariableDeclarator' ? firstDeclaration.id : firstDeclaration
			if (!varID || varID.type !== 'Identifier' || varID.name !== varName) {
				return false
			}

			comp = variablePath.get('declarations', 0).get('init')
			return false
		},

		visitClassDeclaration(classPath) {
			const classID = classPath.node.id
			if (!classID || classID.type !== 'Identifier' || classID.name !== varName) {
				return false
			}

			comp = classPath
			return false
		}
	})
	return comp
}
