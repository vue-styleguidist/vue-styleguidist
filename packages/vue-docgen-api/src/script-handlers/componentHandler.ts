import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import Documentation, { Tag } from '../Documentation'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'
import transformTagsIntoObject from '../utils/transformTagsIntoObject'
import getProperties from './utils/getProperties'

/**
 * Extracts prop information from an object-style VueJs component
 * @param documentation
 * @param path
 */
export default function propHandler(documentation: Documentation, path: NodePath): Promise<void> {
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
		componentCommentedPath = componentCommentedPath.parentPath.parentPath
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
	const docBlock = getDocblock(componentCommentedPath)

	// if no prop return
	if (!docBlock || !docBlock.length) {
		return Promise.resolve()
	}

	const jsDoc = getDoclets(docBlock)

	documentation.set('description', jsDoc.description)

	if (jsDoc.tags) {
		const displayNamesTags = jsDoc.tags.filter(t => t.title === 'displayName')
		if (displayNamesTags.length) {
			const displayName = displayNamesTags[0] as Tag
			documentation.set('displayName', displayName.content)
		}

		const tagsAsObject = transformTagsIntoObject(
			jsDoc.tags.filter(t => t.title !== 'example' && t.title !== 'displayName') || []
		)

		const examples = jsDoc.tags.filter(t => t.title === 'example')
		if (examples.length) {
			tagsAsObject.examples = examples
		}

		documentation.set('tags', tagsAsObject)
	} else {
		documentation.set('tags', {})
	}
	return Promise.resolve()
}
