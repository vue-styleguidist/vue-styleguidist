import { visit } from 'recast'
import { defineHandler } from './utils/tsUtils'
import { parseDocblock } from '../utils/getDocblock'
import { Node } from '@babel/types'
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
				if (acc) return acc;
				const descriptionComment = node.leadingComments?.find((comment) => {
					if (!comment.value.includes('@description')) return;
					return true;
				});
				if (!descriptionComment) return acc;
				return parseDocblock(descriptionComment.value)
					.replace('@description', '')
					.replace(/@displayName.*/, '')
					.trim();
			}, null)
			if (!description) return false;
			documentation.set('description', description);
			return false;
		},
	})
})