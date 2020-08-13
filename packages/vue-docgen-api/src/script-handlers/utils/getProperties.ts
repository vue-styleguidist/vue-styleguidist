import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'

export default function getProperties(path: NodePath, id: string): NodePath[] {
	return path
		.get('properties')
		.filter(
			(p: NodePath) =>
				(bt.isObjectProperty(p.node) || bt.isObjectMethod(p.node)) &&
				bt.isIdentifier(p.node.key) &&
				p.node.key.name === id
		)
}
