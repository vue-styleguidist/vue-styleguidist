import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import { visit } from 'recast'
import Documentation, { ParamTag, ParamType } from '../Documentation'
import { getSlotComment } from './slotHandler'
import getProperties from './utils/getProperties'

export interface TypedParamTag extends ParamTag {
	type: ParamType
}

/**
 * Extract slots information form the render function of an object-style VueJs component
 * @param documentation
 * @param path
 */
export default function slotHandler(documentation: Documentation, path: NodePath): Promise<void> {
	if (bt.isObjectExpression(path.node)) {
		const functionalPath: NodePath<bt.BooleanLiteral>[] = getProperties(path, 'functional')

		// if no prop return
		if (!functionalPath.length || !functionalPath[0].get('value')) {
			return Promise.resolve()
		}

		const renderPath = getProperties(path, 'render')
		if (!renderPath || !renderPath.length) {
			return Promise.resolve()
		}

		const renderValuePath = bt.isObjectProperty(renderPath[0].node)
			? renderPath[0].get('value')
			: renderPath[0]

		const contextVariable = renderValuePath.get('params', 1)
		if (contextVariable.value) {
			if (bt.isIdentifier(contextVariable.value)) {
				const contextVariableName = contextVariable.value.name
				visit(renderValuePath.node, {
					// context.children
					visitMemberExpression(pathMember) {
						if (
							pathMember.node.object.type === 'Identifier' &&
							pathMember.node.object.name === contextVariableName &&
							pathMember.node.property.type === 'Identifier' &&
							pathMember.node.property.name === 'children'
						) {
							const doc = documentation.getSlotDescriptor('default')
							getSlotComment(pathMember, doc)
							return false
						}
						this.traverse(pathMember)
						return undefined
					}
				})
			} else {
				const childrenVarValueName = contextVariable
					.get('properties')
					.value.filter(
						(a: bt.ObjectProperty) => bt.isIdentifier(a.key) && a.key.name === 'children'
					)[0]?.value.name
				visit(renderValuePath.node, {
					// destructured children
					visitIdentifier(pathMember) {
						if (pathMember.node.name === childrenVarValueName) {
							const doc = documentation.getSlotDescriptor('default')
							getSlotComment(pathMember, doc)
							return false
						}
						this.traverse(pathMember)
						return undefined
					}
				})
			}
		}
	}
	return Promise.resolve()
}
