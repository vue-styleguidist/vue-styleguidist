import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import { visit, print } from 'recast'
import { defineHandler, getTypeDefinitionFromIdentifier } from './utils/tsUtils'
import Documentation from '../Documentation'

/**
 * Extract information from an setup-style VueJs 3 component
 * about what props can be used with this component
 * @param {NodePath} astPath
 * @param {Array<NodePath>} componentDefinitions
 * @param {string} originalFilePath
 */
export default defineHandler(async function setupSlotHandler(
	documentation,
	componentDefinition,
	astPath,
	opt
) {
	let propsDef: NodePath<any, any> | undefined
	visit(astPath.program, {
		visitCallExpression(nodePath) {
			if (
				bt.isIdentifier(nodePath.node.callee) &&
				nodePath.node.callee.name === 'defineSlots' &&
				(nodePath.node as any).typeParameters
			) {
				const typeParamsPath = nodePath.get('typeParameters', 'params', 0)
				if (bt.isTSTypeLiteral(typeParamsPath.node)) {
					// if the slots are defined as a literal type
					getSlotsFromLiteralType(documentation, typeParamsPath.get('members'))
				} else if (
					bt.isTSTypeReference(typeParamsPath.node) &&
					bt.isIdentifier(typeParamsPath.node.typeName)
				) {
					// its a reference to an interface or type
					const typeName = typeParamsPath.node.typeName.name // extract the identifier

					// find it's definition in the file
					const definitionPath = getTypeDefinitionFromIdentifier(astPath, typeName, opt)

					// use the same process to exact info
					if (definitionPath) {
						getSlotsFromLiteralType(documentation, definitionPath)
					}
				}
			}
			return false
		}
	})
	return
})

function getSlotsFromLiteralType(documentation: Documentation, members: any) {
	members.each((propPath: NodePath) => {
		const propName = propPath.get('key').node.name
		const propDescriptor = documentation.getSlotDescriptor(propName)
		propDescriptor.name = propName
	})
}
