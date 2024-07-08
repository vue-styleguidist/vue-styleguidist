import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import { visit } from 'recast'
import Documentation, { Tag } from '../Documentation'
import { setEventDescriptor } from './eventHandler'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'
import resolveIdentifier from '../utils/resolveIdentifier'

/**
 * Extracts all events from a class-style component code
 * @param documentation
 * @param path
 * @param astPath
 */
export default function classEventHandler(
	documentation: Documentation,
	path: NodePath,
	astPath: bt.File
): Promise<void> {
	if (bt.isClassDeclaration(path.node)) {
		visit(path.node, {
			visitClassMethod(nodePath) {
				if (
					nodePath.node.decorators &&
					nodePath.node.decorators[0].expression.type === 'CallExpression' &&
					nodePath.node.decorators[0].expression.callee.type === 'Identifier' &&
					nodePath.node.decorators[0].expression.callee.name === 'Emit'
				) {
					// fetch the leading comments on the wrapping expression
					const docblock = getDocblock(nodePath)
					const doclets = getDoclets(docblock || '')
					let eventName: string
					const eventTags = doclets.tags ? doclets.tags.filter(d => d.title === 'event') : []

					const exp = nodePath.get('decorators', 0).get('expression')

					// if someone wants to document it with anything else, they can force it
					if (eventTags.length) {
						eventName = (eventTags[0] as Tag).content as string
					} else if (exp.get('arguments').value.length) {
						let firstArg = exp.get('arguments', 0)
						if (bt.isIdentifier(firstArg.node)) {
							firstArg = resolveIdentifier(astPath, firstArg)
						}

						if (!bt.isStringLiteral(firstArg.node)) {
							return false
						}
						eventName = firstArg.node.value
					} else if (nodePath.node.key.type === 'Identifier') {
						eventName = nodePath.node.key.name
					} else {
						return false
					}

					const evtDescriptor = documentation.getEventDescriptor(eventName)
					setEventDescriptor(evtDescriptor, doclets)
					return false
				}
				this.traverse(nodePath)
			}
		})
	}
	return Promise.resolve()
}
