import { visit } from 'recast'
import { Node } from '@babel/types'
import { defineHandler } from './utils/tsUtils'
import { parseDocblock } from '../utils/getDocblock'
/**
 * Extract description from an setup-style VueJs 3 component
 * from description tag 
 * @param {NodePath} astPath
 * @param {Array<NodePath>} componentDefinitions
 * @param {string} originalFilePath
 */
export default defineHandler(async function setupDescriptionHandler(
	documentation,
	componentDefinition,
	astPath,
) {
	visit(astPath.program, {
		visitProgram(path) {
			const body = path.value.body as Node[];
			const description = body.reduce((acc, node) => {
				if (acc || !node.leadingComments) return acc;
				const descriptionComment = node.leadingComments
					.find((comment) => comment.value.includes('@description'));
				return descriptionComment
					? parseDocblock(descriptionComment.value)
						.replace('@description', '')
						.replace(/@displayName.*/, '')
						.trim()
					: acc;
			}, null)
			if (!description) return false;
			documentation.set('description', description);
			return false;
		},
	})
})