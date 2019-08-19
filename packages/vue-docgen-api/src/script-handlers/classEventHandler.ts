import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import recast from 'recast'
import Documentation, { Tag } from '../Documentation'
import { setEventDescriptor } from './eventHandler'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'
import resolveIdentifier from '../utils/resolveIdentifier'

export default function classEventHandler(
	documentation: Documentation,
	path: NodePath,
	astPath: bt.File
) {
	if (bt.isClassDeclaration(path.node)) {
		recast.visit(path.node, {
			visitClassMethod(path) {
				if (
					path.node.decorators &&
					bt.isCallExpression(path.node.decorators[0].expression) &&
					bt.isIdentifier(path.node.decorators[0].expression.callee) &&
					path.node.decorators[0].expression.callee.name === 'Emit'
				) {
					// fetch the leading comments on the wrapping expression
					const docblock = getDocblock(path)
					const doclets = getDoclets(docblock || '')
					let eventName: string
					const eventTags = doclets.tags ? doclets.tags.filter(d => d.title === 'event') : []

					const exp = path.get('decorators', 0).get('expression')

					// if someone wants to document it with anything else, they can force it
					if (eventTags.length) {
						eventName = (eventTags[0] as Tag).content as string
					} else {
						if (exp.get('arguments').value.length) {
							let firstArg = exp.get('arguments', 0)
							if (bt.isIdentifier(firstArg.node)) {
								firstArg = resolveIdentifier(astPath, firstArg)
							}

							if (!bt.isStringLiteral(firstArg.node)) {
								return false
							}
							eventName = firstArg.node.value
						} else if (bt.isIdentifier(path.node.key)) {
							eventName = path.node.key.name
						} else {
							return false
						}
					}

					const evtDescriptor = documentation.getEventDescriptor(eventName)
					setEventDescriptor(evtDescriptor, doclets)
					return false
				}
			}
		})
	}
}
