import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import { visit, print } from 'recast'
import getTypeFromAnnotation, { decorateItem } from '../utils/getTypeFromAnnotation'
import type { Documentation } from '../Documentation'
import type { ParseOptions } from '../types'
import { describePropsFromValue } from '../script-handlers/propHandler'
import { getTypeDefinitionFromIdentifier } from './utils/tsUtils'

/**
 * Extract information from an setup-style VueJs 3 component
 * about what props can be used with this component
 * @param {NodePath} astPath
 * @param {Array<NodePath>} componentDefinitions
 * @param {string} originalFilePath
 */
export default async function setupPropHandler(
	documentation: Documentation,
	componentDefinition: NodePath,
	astPath: bt.File,
	opt: ParseOptions
) {
	let propsDef: NodePath<any, any> | undefined
	visit(astPath.program, {
		visitCallExpression(nodePath) {
			const hasDefaults =
				bt.isIdentifier(nodePath.node.callee) && nodePath.node.callee.name === 'withDefaults'
			const normalizedNodePath = hasDefaults ? nodePath.get('arguments', 0) : nodePath

			if (
				bt.isIdentifier(normalizedNodePath.node.callee) &&
				normalizedNodePath.node.callee.name === 'defineProps'
			) {
				propsDef = normalizedNodePath.get('arguments', 0)

				if ((normalizedNodePath.node as any).typeParameters) {
					const typeParamsPath = normalizedNodePath.get('typeParameters', 'params', 0)
					if (bt.isTSTypeLiteral(typeParamsPath.node)) {
						getPropsFromLiteralType(documentation, typeParamsPath.get('members'), astPath)
					} else if (
						bt.isTSTypeReference(typeParamsPath.node) &&
						bt.isIdentifier(typeParamsPath.node.typeName)
					) {
						// its a reference to an interface or type
						const typeName = typeParamsPath.node.typeName.name // extract the identifier
						// find it's definition in the file
						const definitionPath = getTypeDefinitionFromIdentifier(astPath, typeName)
						// use the same process to exact info
						if (definitionPath) {
							getPropsFromLiteralType(documentation, definitionPath, astPath)
						}
					}
				}

				// add defaults from withDefaults
				if (hasDefaults) {
					const defaults = nodePath.get('arguments', 1)
					if (bt.isObjectExpression(defaults.node)) {
						defaults.get('properties').each((propPath: NodePath) => {
							const propName = propPath.get('key').node.name
							const propValue = propPath.get('value')
							const propDescriptor = documentation.getPropDescriptor(propName)
							propDescriptor.defaultValue = {
								func: false,
								value: print(propValue).code
							}
						})
					}
				}
			}
			return false
		}
	})

	// this is JavaScript typing
	if (propsDef) {
		await describePropsFromValue(documentation, propsDef, astPath, opt)
	}
}

export function getPropsFromLiteralType(
	documentation: Documentation,
	typeParamsPathMembers: any,
	astPath: bt.File
): void {
	typeParamsPathMembers.each((prop: NodePath) => {
		if (bt.isTSPropertySignature(prop.node) && bt.isIdentifier(prop.node.key)) {
			const propDescriptor = documentation.getPropDescriptor(prop.node.key.name)

			decorateItem(prop, propDescriptor)

			propDescriptor.required = !prop.node.optional

			propDescriptor.type = getTypeFromAnnotation(prop.get('typeAnnotation').value, astPath)
		}
	})
}
