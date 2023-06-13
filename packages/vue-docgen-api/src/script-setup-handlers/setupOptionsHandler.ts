import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import { visit } from 'recast'
import Documentation from '../Documentation'
import type { ParseOptions } from '../types'

/**
 * Extract information from an setup-style VueJs 3 component
 * about what events can be emitted
 * @param {NodePath} astPath
 * @param {Array<NodePath>} componentDefinitions
 * @param {string} originalFilePath
 */
export default async function setupOptionsHandler(
	documentation: Documentation,
	componentDefinition: NodePath,
	astPath: bt.File,
	opt: ParseOptions
) {
	visit(astPath.program, {
		visitCallExpression(nodePath) {
			if (bt.isIdentifier(nodePath.node.callee) && nodePath.node.callee.name === 'defineOptions') {
				// here be dragons
			}

			return false
		}
	})
}
