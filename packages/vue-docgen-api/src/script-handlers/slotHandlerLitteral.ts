import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import Documentation, { ParamTag, ParamType, Tag } from '../Documentation'
import getDoclets from '../utils/getDoclets'
import getProperties from './utils/getProperties'
import getDocblock from '../utils/getDocblock'

export interface TypedParamTag extends ParamTag {
	type: ParamType
}

/**
 * Extract slots information form the render function of an object-style VueJs component
 * @param documentation
 * @param path
 */
export default function slotHandler(documentation: Documentation, path: NodePath): Promise<void> {
	if (bt.isObjectExpression(path.node)) {
		const renderPath = getProperties(path, 'render')

		if (!renderPath.length) {
			return Promise.resolve()
		}

		let i = 0
		let docBlock = getDocblock(renderPath[0], { commentIndex: i })
		while (docBlock) {
			// if no doc block return
			if (!docBlock || !docBlock.length) {
				return Promise.resolve()
			}

			const jsDoc = getDoclets(docBlock)
			if (jsDoc.tags) {
				const slotTag = jsDoc.tags.find(a => a.title === 'slot') as Tag
				if (slotTag) {
					const name = typeof slotTag.content === 'string' ? slotTag.content : 'default'
					const slotDescriptor = documentation.getSlotDescriptor(name)
					slotDescriptor.description = jsDoc.description
					const bindingsTag = jsDoc.tags.filter(t => t.title === 'binding') as ParamTag[]
					if (bindingsTag) {
						slotDescriptor.bindings = bindingsTag
					}
				}
			}
			docBlock = getDocblock(renderPath[0], { commentIndex: ++i })
		}
	}
	return Promise.resolve()
}
