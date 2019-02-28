import * as bt from '@babel/types'
import { NodePath } from 'ast-types'

/**
 * Helper functions to work with docblock comments.
 */

/**
 * Extracts the text from a docblock comment
 * @param {rawDocblock} str
 * @return str stripped from stars and spaces
 */
export function parseDocblock(str: string): string {
  const lines = str.split('\n')
  for (let i = 0, l = lines.length; i < l; i++) {
    lines[i] = lines[i].replace(/^\s*\*\s?/, '').replace(/\r$/, '')
  }
  return lines.join('\n').trim()
}

const DOCBLOCK_HEADER = /^\*\s/

/**
 * Given a path, this function returns the closest preceding docblock if it
 * exists.
 */
export default function getDocblock(path: NodePath, trailing = false): string | null {
  let comments: bt.Comment[] = []
  if (trailing && path.node.trailingComments) {
    comments = path.node.trailingComments.filter(
      (comment: bt.Comment) =>
        comment.type === 'CommentBlock' && DOCBLOCK_HEADER.test(comment.value),
    )
  } else if (path.node.leadingComments) {
    comments = path.node.leadingComments.filter(
      (comment: bt.Comment) =>
        comment.type === 'CommentBlock' && DOCBLOCK_HEADER.test(comment.value),
    )
  }

  if (comments.length > 0) {
    return parseDocblock(comments[comments.length - 1].value)
  }
  return null
}
