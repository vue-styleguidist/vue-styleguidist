import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'

export default function getMemberFilter(
	propName: string
): (propPath: NodePath<bt.ObjectProperty>) => boolean {
	return p => p.node.key.name === propName || p.node.key.value === propName
}
