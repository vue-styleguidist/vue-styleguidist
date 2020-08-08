import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'

export default function getMemberFilter(
	propName: string
): (propPath: NodePath<bt.ObjectProperty>) => boolean {
	return p =>
		bt.isIdentifier(p.node.key)
			? p.node.key.name === propName
			: bt.isStringLiteral(p.node.key)
			? p.node.key.value === propName
			: false
}
