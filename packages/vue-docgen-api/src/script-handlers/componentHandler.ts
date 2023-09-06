import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import Documentation from '../Documentation'
import getProperties from './utils/getProperties'
import handleComponentJSDoc from '../utils/handleComponentJSDoc'

/**
 * Extracts prop information from an object-style VueJs component
 * @param documentation
 * @param path
 */
export default function componentHandler(
	documentation: Documentation,
	path: NodePath
): Promise<void> {
	// deal with functional flag
	if (bt.isObjectExpression(path.node)) {
		const functionalPath = getProperties(path, 'functional')

		if (functionalPath.length) {
			const functionalValue = functionalPath[0].get('value').node
			if (bt.isBooleanLiteral(functionalValue)) {
				documentation.set('functional', functionalValue.value)
			}
		}
	}

	let componentCommentedPath = path.parentPath
	// in case of Vue.extend() structure
	if (bt.isCallExpression(componentCommentedPath.node)) {
		// look for leading comments in the parent structures
		let i = 5
		while (
			i-- &&
			!componentCommentedPath.get('leadingComments').value &&
			componentCommentedPath.parentPath.node.type !== 'Program'
		) {
			componentCommentedPath = componentCommentedPath.parentPath
		}
	} else if (bt.isVariableDeclarator(componentCommentedPath.node)) {
		componentCommentedPath = componentCommentedPath.parentPath.parentPath
		if (componentCommentedPath.parentPath.node.type !== 'Program') {
			componentCommentedPath = componentCommentedPath.parentPath
		}
	} else if (bt.isDeclaration(componentCommentedPath.node)) {
		const classDeclaration = componentCommentedPath.get('declaration')
		if (bt.isClassDeclaration(classDeclaration.node)) {
			componentCommentedPath = classDeclaration
		}
	}

	// always return a promise to trigger next handler in chain
	return handleComponentJSDoc(componentCommentedPath, documentation)
}
