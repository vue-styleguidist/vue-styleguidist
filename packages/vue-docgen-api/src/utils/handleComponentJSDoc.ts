import { NodePath } from 'ast-types/lib/node-path'
import getDocblock from './getDocblock'
import getDoclets from './getDoclets'
import transformTagsIntoObject from './transformTagsIntoObject'
import Documentation, { Tag } from '../Documentation'

/**
 * Reads the data from a JSDoc block of a component
 * and adds it to the documentation object
 * @param componentCommentedPath the AST path of the component
 * @param documentation the documentation object to modify
 * @returns
 */
export default function handleComponentJSDoc(
	componentCommentedPath: NodePath,
	documentation: Documentation
) {
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
