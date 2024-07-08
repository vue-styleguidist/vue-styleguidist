import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import { visit } from 'recast'
import Documentation, { DocBlockTags, ExposeDescriptor } from '../Documentation'
import type { ParseOptions } from '../types'
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
	function buildExposeDescriptor(exposedName: string, exposedPath: NodePath) {
		const exposeDescriptor = documentation.getExposeDescriptor(exposedName)
		const docBlock = getDocblock(exposedPath)
		if (docBlock) {
			const jsDoc = getDoclets(docBlock)
			setExposeDescriptor(exposeDescriptor, jsDoc)
		}
	}

	function setExposeDescriptor(exposeDescriptor: ExposeDescriptor, jsDoc: DocBlockTags) {
		if (jsDoc.description && jsDoc.description.length) {
			exposeDescriptor.description = jsDoc.description
		}
		if (jsDoc.tags?.length) {
			exposeDescriptor.tags = jsDoc.tags
		}
	}

	visit(astPath.program, {
		visitCallExpression(nodePath) {
			if (
				nodePath.node.callee.type === 'Identifier' &&
				nodePath.node.callee.name === 'defineExpose'
			) {
				if (bt.isObjectExpression(nodePath.get('arguments', 0).node)) {
					nodePath.get('arguments', 0, 'properties').each((prop: NodePath<bt.ObjectProperty>) => {
						if (bt.isIdentifier(prop.node.key)) {
							buildExposeDescriptor(prop.node.key.name, prop)
						} else if (bt.isStringLiteral(prop.node.key)) {
							buildExposeDescriptor(prop.node.key.value, prop)
						}
					})
				} else if (bt.isArrayExpression(nodePath.get('arguments', 0).node)) {
					nodePath.get('arguments', 0, 'elements').each((prop: NodePath<bt.Node>) => {
						if (bt.isStringLiteral(prop.node)) {
							buildExposeDescriptor(prop.node.value, prop)
						}
					})
				}
			}
			return false
		}
	})
}
