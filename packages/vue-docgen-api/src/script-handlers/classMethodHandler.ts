import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import Documentation, { BlockTag, DocBlockTags, MethodDescriptor, Tag } from '../Documentation'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'
import { setMethodDescriptor } from './methodHandler'

/**
 * Extracts all information about methods in a class-style Component
 * @param documentation
 * @param path
 */
export default function classMethodHandler(
	documentation: Documentation,
	path: NodePath
): Promise<void> {
	if (bt.isClassDeclaration(path.node)) {
		const methods: MethodDescriptor[] = documentation.get('methods') || []
		const allMethods = path
			.get('body')
			.get('body')
			.filter((a: NodePath) => bt.isClassMethod(a.node))

		allMethods.forEach((methodPath: NodePath<bt.ClassMethod>) => {
			const methodName = bt.isIdentifier(methodPath.node.key)
				? methodPath.node.key.name
				: '<anonymous>'

			const docBlock = getDocblock(
				bt.isClassMethod(methodPath.node) ? methodPath : methodPath.parentPath
			)

			const jsDoc: DocBlockTags = docBlock ? getDoclets(docBlock) : { description: '', tags: [] }
			const jsDocTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : []

			// ignore the method if there is no public tag
			if (!jsDocTags.some((t: Tag) => t.title === 'access' && t.content === 'public')) {
				return Promise.resolve()
			}
			const methodDescriptor = documentation.getMethodDescriptor(methodName)
			if (jsDoc.description) {
				methodDescriptor.description = jsDoc.description
			}
			setMethodDescriptor(methodDescriptor, methodPath, jsDocTags)
			return true
		})
		documentation.set('methods', methods)
	}
	return Promise.resolve()
}
