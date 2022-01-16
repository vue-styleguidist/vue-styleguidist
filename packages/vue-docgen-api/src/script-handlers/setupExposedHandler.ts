import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import { visit } from 'recast'
import Documentation, { DocBlockTags, ExposedDescriptor } from '../Documentation'
import { ParseOptions } from '../parse'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'

/**
 * Extract information from an setup-style VueJs 3 component
 * about what methods and variable are exposed
 * @param {NodePath} astPath
 * @param {Array<NodePath>} componentDefinitions
 * @param {string} originalFilePath
 */
export default async function setupExposedHandler(
	documentation: Documentation,
	componentDefinition: NodePath,
	astPath: bt.File,
	opt: ParseOptions
) {
	function buildExposedDescriptor(exposedName: string, exposedPath: NodePath) {
		const exposedDescriptor = documentation.getExposedDescriptor(exposedName)
		const docBlock = getDocblock(exposedPath)
		if (docBlock) {
			const jsDoc = getDoclets(docBlock)
			setExposedDescriptor(exposedDescriptor, jsDoc)
		}
	}

	function setExposedDescriptor(exposedDescriptor: ExposedDescriptor, jsDoc: DocBlockTags) {
		if (jsDoc.description && jsDoc.description.length) {
			exposedDescriptor.description = jsDoc.description
		}
		if (jsDoc.tags?.length) {
			exposedDescriptor.tags = jsDoc.tags
		}
	}

	visit(astPath.program, {
		visitCallExpression(nodePath) {
			if (bt.isIdentifier(nodePath.node.callee) && nodePath.node.callee.name === 'defineExposed') {
				if (bt.isObjectExpression(nodePath.get('arguments', 0).node)) {
					nodePath.get('arguments', 0, 'properties').each((prop: NodePath<bt.ObjectProperty>) => {
						if (bt.isIdentifier(prop.node.key)) {
							buildExposedDescriptor(prop.node.key.name, prop)
						} else if (bt.isStringLiteral(prop.node.key)) {
							buildExposedDescriptor(prop.node.key.value, prop)
						}
					})
				}
			}
			return false
		}
	})
}
