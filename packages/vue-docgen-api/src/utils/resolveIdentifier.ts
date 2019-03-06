import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import recast from 'recast'

function ignore(): boolean {
	return false
}

export default function resolveIdentifier(ast: bt.File, path: NodePath): NodePath | null {
	if (!bt.isIdentifier(path.node)) {
		return path
	}

	const varName = path.node.name
	let comp: NodePath | null = null

	recast.visit(ast.program, {
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
			if (!bt.isVariableDeclaration(variablePath.node)) {
				return false
			}
			const varID = variablePath.node.declarations[0].id
			if (!varID || !bt.isIdentifier(varID) || varID.name !== varName) {
				return false
			}

			comp = variablePath.get('declarations', 0).get('init')
			return false
		},

		visitClassDeclaration(classPath) {
			const classID = classPath.node.id
			if (!classID || !bt.isIdentifier(classID) || classID.name !== varName) {
				return false
			}

			comp = classPath
			return false
		}
	})
	return comp
}
