import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import { visit } from 'recast'
import { defineHandler, getTypeDefinitionFromIdentifier } from './utils/tsUtils'
import Documentation, { BlockTag, DocBlockTags, ParamTag, SlotDescriptor } from '../Documentation'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'
import transformTagsIntoObject from '../utils/transformTagsIntoObject'

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
	visit(astPath.program, {
		visitCallExpression(nodePath) {
			if (
				nodePath.node.callee.type === 'Identifier' &&
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
		const slotName = propPath.get('key').node.name
		const slotDescriptor = documentation.getSlotDescriptor(slotName)
		slotDescriptor.name = slotName
		parseDocBlock(slotDescriptor, propPath)
		if (bt.isTSMethodSignature(propPath.node)) {
			const p = propPath.get('parameters', 0, 'typeAnnotation', 'typeAnnotation')
			if (bt.isTSTypeLiteral(p.node)) {
				let bindingDescriptors: ParamTag[] = []
				p.get('members').each((paramPath: NodePath) => {
					const paramName = paramPath.get('key')?.value?.name
					const docBlock = getDocblock(paramPath)
					const jsDoc: DocBlockTags = docBlock
						? getDoclets(docBlock)
						: { description: '', tags: [] }

					bindingDescriptors.push({
						name: paramName,
						title: 'binding',
						description: jsDoc.description
					})
				})

				if (bindingDescriptors.length) {
					slotDescriptor.scoped = true
					slotDescriptor.bindings = bindingDescriptors
				}
			}
		}
	})
}

function parseDocBlock(descriptor: SlotDescriptor, path: NodePath) {
	const docBlock = getDocblock(path)
	const jsDoc: DocBlockTags = docBlock ? getDoclets(docBlock) : { description: '', tags: [] }
	const jsDocTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : []

	if (jsDoc.description) {
		descriptor.description = jsDoc.description
	}

	if (jsDocTags.length) {
		descriptor.tags = transformTagsIntoObject(jsDocTags)
	}
}
