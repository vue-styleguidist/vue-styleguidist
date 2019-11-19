import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import Documentation, { Tag } from '../Documentation'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'
import transformTagsIntoObject from '../utils/transformTagsIntoObject'

export default async function propHandler(documentation: Documentation, path: NodePath) {
	// deal with functional flag
	if (bt.isObjectExpression(path.node)) {
		const functionalPath = path
			.get('properties')
			.filter((p: NodePath) => bt.isObjectProperty(p.node) && p.node.key.name === 'functional')

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
	} else if(bt.isVariableDeclarator(componentCommentedPath.node)) {
		componentCommentedPath = componentCommentedPath.parentPath.parentPath.parentPath
	} else if (bt.isDeclaration(componentCommentedPath.node)) {
		const classDeclaration = componentCommentedPath.get('declaration')
		if (bt.isClassDeclaration(classDeclaration.node)) {
			componentCommentedPath = classDeclaration
		}
	}
	const docBlock = getDocblock(componentCommentedPath)

	// if no prop return
	if (!docBlock || !docBlock.length) {
		return
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
}
