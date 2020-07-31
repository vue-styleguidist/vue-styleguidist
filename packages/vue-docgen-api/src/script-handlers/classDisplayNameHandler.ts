import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import Documentation from '../Documentation'
import getArgFromDecorator from '../utils/getArgFromDecorator'
import getProperties from './utils/getProperties'

/**
 * Extracts the name of the component from a class-style component
 * @param documentation
 * @param path
 */
export default async function classDisplayNameHandler(
	documentation: Documentation,
	path: NodePath
) {
	if (bt.isClassDeclaration(path.node)) {
		const config = getArgFromDecorator(path.get('decorators') as NodePath<bt.Decorator>)

		let displayName: string | undefined
		if (config && bt.isObjectExpression(config.node)) {
			getProperties(config, 'name').forEach((p: NodePath<bt.ObjectProperty>) => {
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
