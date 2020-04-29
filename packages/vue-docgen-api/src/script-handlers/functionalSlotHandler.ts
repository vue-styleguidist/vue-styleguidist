import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import recast from 'recast'
import Documentation, { ParamTag, ParamType } from '../Documentation'
import { getSlotComment } from './slotHandler'

export interface TypedParamTag extends ParamTag {
	type: ParamType
}

/**
 * Extract slots information form the render function of an object-style VueJs component
 * @param documentation
 * @param path
 */
export default async function slotHandler(documentation: Documentation, path: NodePath) {
	if (bt.isObjectExpression(path.node)) {
		const functionalPath: NodePath<bt.BooleanLiteral>[] = path
			.get('properties')
			.filter((p: NodePath) => bt.isObjectProperty(p.node) && p.node.key.name === 'functional')

		// if no prop return
		if (!functionalPath.length || !functionalPath[0].get('value')) {
			return
		}

		const renderPath = path
			.get('properties')
			.filter(
				(p: NodePath) =>
					(bt.isObjectProperty(p.node) || bt.isObjectMethod(p.node)) && p.node.key.name === 'render'
			)

		const renderValuePath = bt.isObjectProperty(renderPath[0].node)
			? renderPath[0].get('value')
			: renderPath[0]

		const contextVariable = renderValuePath.get('params', 1)
		if (contextVariable.value) {
			const contextVariableName = contextVariable.value.name
			recast.visit(renderValuePath.node, {
				// context.children
				visitMemberExpression(pathMember) {
					if (
						bt.isIdentifier(pathMember.node.object) &&
						(pathMember.node.object.name === contextVariableName &&
							bt.isIdentifier(pathMember.node.property) &&
							pathMember.node.property.name === 'children')
					) {
						const doc = documentation.getSlotDescriptor('default')
						getSlotComment(pathMember, doc)
						return false
					}
					this.traverse(pathMember)
				}
			})
		}
	}
}
