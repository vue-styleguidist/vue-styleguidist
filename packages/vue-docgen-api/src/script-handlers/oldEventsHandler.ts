import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import recast from 'recast'
import { BlockTag, Documentation, Tag } from '../Documentation'
import { setEventDescriptor } from '../script-handlers/eventHandler'
import { parseDocblock } from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'

export default function oldEventsHanlder(
  documentation: Documentation,
  path: NodePath,
  ast: bt.File,
) {
  recast.visit(ast.program, {
    visitComment(commentPath: NodePath) {
      const comment = commentPath.node.leadingComments && commentPath.node.leadingComments[0]
      // only observe block comments
      if (!comment || comment.type !== 'CommentBlock') {
        return false
      }

      const docblock = parseDocblock(comment.value)

      const jsDoc = getDoclets(docblock)

      // filter comments where a tag is @event
      const nonNullTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : []
      const eventTag = nonNullTags.filter(t => t.title === 'event')

      if (!eventTag.length) {
        return false
      }

      const eventTagContent = (eventTag[0] as Tag).content
      const eventName = typeof eventTagContent === 'string' ? eventTagContent : undefined

      if (eventName) {
        const descriptor = documentation.getEventDescriptor(eventName)
        setEventDescriptor(descriptor, jsDoc)
      }
      return false
    },
  })
}
