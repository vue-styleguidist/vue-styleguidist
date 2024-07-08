import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import { visit } from 'recast'
import Documentation from '../Documentation'
import type { ParseOptions } from '../types'
import handleComponentJSDoc from '../utils/handleComponentJSDoc'

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
			if (
				nodePath.node.callee.type === 'Identifier' &&
				nodePath.node.callee.name === 'defineOptions' &&
				nodePath.node.arguments[0].type === 'ObjectExpression'
			) {
				const options = nodePath.node.arguments[0]
				options.properties.forEach(property => {
					if (property.type === 'ObjectProperty' && property.key.type === 'Identifier') {
						const key = property.key.name
						if (key === 'name' && property.value.type === 'StringLiteral') {
							documentation.set('name', property.value.value)
						}
					}
				})

				handleComponentJSDoc(nodePath, documentation)
			}

			return false
		}
	})
}
