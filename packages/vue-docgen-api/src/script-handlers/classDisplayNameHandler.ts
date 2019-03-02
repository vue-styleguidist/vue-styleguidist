import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { Documentation } from '../Documentation'

export default function classDisplayNameHandler(documentation: Documentation, path: NodePath) {
	if (bt.isClassDeclaration(path.node)) {
		const config = getArgFromDecorator(path.get('decorators') as NodePath<bt.Decorator>)

		let displayName: string | undefined
		if (config && bt.isObjectExpression(config.node)) {
			config
				.get('properties')
				.filter((p: NodePath) => bt.isObjectProperty(p.node) && p.node.key.name === 'name')
				.forEach((p: NodePath<bt.ObjectProperty>) => {
					const valuePath = p.get('value')
					if (bt.isStringLiteral(valuePath.node)) {
						displayName = valuePath.node.value
					}
				})
		} else {
			displayName = path.node.id ? path.node.id.name : undefined
		}

		if (displayName) {
			documentation.set('displayName', displayName)
		}
	}
}

function getArgFromDecorator(
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
