import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import { visit } from 'recast'
import Documentation from '../Documentation'
import { ParseOptions } from '../parse'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'
import getTypeFromAnnotation from '../utils/getTypeFromAnnotation'
import { setEventDescriptor } from '../script-handlers/eventHandler'
import { getTypeDefinitionFromIdentifier } from './utils/tsUtils'

/**
 * Extract information from an setup-style VueJs 3 component
 * about what events can be emitted
 * @param {NodePath} astPath
 * @param {Array<NodePath>} componentDefinitions
 * @param {string} originalFilePath
 */
export default async function setupEventHandler(
	documentation: Documentation,
	componentDefinition: NodePath,
	astPath: bt.File,
	opt: ParseOptions
) {
	function buildEventDescriptor(eventName: string, eventPath: NodePath) {
		const eventDescriptor = documentation.getEventDescriptor(eventName)

		const typeParam = eventPath.get('parameters', 1, 'typeAnnotation')
		if (bt.isTSTypeAnnotation(typeParam.node)) {
			const type = getTypeFromAnnotation(typeParam.node)?.name
			if (type) {
				eventDescriptor.type = { names: [type] }
			}
		}

		const docBlock = getDocblock(eventPath)
		if (docBlock) {
			const jsDoc = getDoclets(docBlock)
			setEventDescriptor(eventDescriptor, jsDoc)
		}
	}

	function readEventsTSTypes(refs: any) {
		refs.each((member: NodePath) => {
			if (bt.isTSCallSignatureDeclaration(member.node)) {
				const firstParam = member.node.parameters[0].typeAnnotation
				if (
					bt.isTSTypeAnnotation(firstParam) &&
					bt.isTSLiteralType(firstParam.typeAnnotation) &&
					!bt.isUnaryExpression(firstParam.typeAnnotation.literal) &&
          !bt.isTemplateLiteral(firstParam.typeAnnotation.literal) &&
					typeof firstParam.typeAnnotation.literal.value === 'string'
				) {
					buildEventDescriptor(firstParam.typeAnnotation.literal.value, member)
				}
			}
		})
	}

	visit(astPath.program, {
		visitCallExpression(nodePath) {
			if (bt.isIdentifier(nodePath.node.callee) && nodePath.node.callee.name === 'defineEmits') {
				// Array of string where no type is specified
				if (bt.isArrayExpression(nodePath.get('arguments', 0).node)) {
					nodePath.get('arguments', 0, 'elements').each((element: NodePath) => {
						if (bt.isStringLiteral(element.node)) {
							buildEventDescriptor(element.node.value, element)
						}
					})
				}

				// Object where the arguments are validated manually
				if (bt.isObjectExpression(nodePath.get('arguments', 0).node)) {
					nodePath.get('arguments', 0, 'properties').each((element: NodePath) => {
						if (bt.isObjectProperty(element.node)) {
							if (bt.isIdentifier(element.node.key)) {
								buildEventDescriptor(element.node.key.name, element)
							} else if (bt.isStringLiteral(element.node.key)) {
								buildEventDescriptor(element.node.key.value, element)
							}
						}
					})
				}

				// typescript validation of arguments
				if (bt.isTSTypeParameterInstantiation(nodePath.get('typeParameters').node)) {
					nodePath.get('typeParameters', 'params').each((param: NodePath) => {
						if (bt.isTSTypeLiteral(param.node)) {
							readEventsTSTypes(param.get('members'))
						} else if (bt.isTSTypeReference(param.node) && bt.isIdentifier(param.node.typeName)) {
							const resolvedType = getTypeDefinitionFromIdentifier(
								astPath,
								param.node.typeName.name
							)
							if (resolvedType) {
								readEventsTSTypes(resolvedType)
							}
						}
					})
				}
			}

			return false
		}
	})
}
