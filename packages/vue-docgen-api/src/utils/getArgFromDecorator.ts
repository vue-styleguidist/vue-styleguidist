import { NodePath } from 'ast-types/lib/node-path'
import * as bt from '@babel/types'

export default function getArgFromDecorator(
	path: NodePath<bt.Decorator>
): null | NodePath<bt.Expression | bt.SpreadElement | bt.JSXNamespacedName> {
	const expForDecorator = path
		.filter((p: NodePath) => {
			const exp = p.get('expression')
			const decoratorIdenifier = bt.isCallExpression(exp.node) ? exp.node.callee : exp.node
			return 'Component' === (bt.isIdentifier(decoratorIdenifier) ? decoratorIdenifier.name : null)
		}, null)[0]
		.get('expression')
	if (bt.isCallExpression(expForDecorator.node)) {
		return expForDecorator.get('arguments', 0) as NodePath<
			bt.Expression | bt.SpreadElement | bt.JSXNamespacedName
		>
	}
	return null
}
