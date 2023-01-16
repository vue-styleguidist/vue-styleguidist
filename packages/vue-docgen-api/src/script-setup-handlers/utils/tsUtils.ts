import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import { visit } from 'recast'

export function getTypeDefinitionFromIdentifier(
	astPath: bt.File,
	typeName: string
): NodePath | undefined {
	let typeBody: NodePath | undefined = undefined
	visit(astPath.program, {
		visitTSInterfaceDeclaration(nodePath) {
			if (bt.isIdentifier(nodePath.node.id) && nodePath.node.id.name === typeName) {
				typeBody = nodePath.get('body', 'body')
			}
			return false
		},
		visitTSTypeAliasDeclaration(nodePath) {
			if (bt.isIdentifier(nodePath.node.id) && nodePath.node.id.name === typeName) {
				typeBody = nodePath.get('typeAnnotation', 'members')
			}
			return false
		}
	})
	return typeBody
}

export default {}