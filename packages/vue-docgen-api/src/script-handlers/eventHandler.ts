import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import { visit } from 'recast'
import Documentation, {
	BlockTag,
	DocBlockTags,
	EventDescriptor,
	ParamTag,
	ParamType,
	Tag
} from '../Documentation'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'
import resolveIdentifier from '../utils/resolveIdentifier'
import getMemberFilter from '../utils/getPropsFilter'

export interface TypedParamTag extends ParamTag {
	type: ParamType
}

function getCommentBlockAndTags(
	p: NodePath,
	{ commentIndex } = { commentIndex: 1 }
): DocBlockTags | null {
	const docBlock = getDocblock(p, { commentIndex })
	return docBlock ? getDoclets(docBlock) : null
}

/**
 * Extracts events information from a VueJs component
 * wether it's a class based component or an option based one
 *
 * @param documentation
 * @param path
 * @param astPath
 */
export default function eventHandler(
	documentation: Documentation,
	path: NodePath,
	astPath: bt.File
): Promise<void> {
	if (bt.isObjectExpression(path.node)) {
		eventHandlerMethods(documentation, path)
		eventHandlerEmits(documentation, path)
	}

	// browse the entirety of the code inside the component to look for this.$emit
	visit(path.node, {
		visitCallExpression(pathExpression) {
			if (
				pathExpression.node.callee.type === 'MemberExpression' &&
				pathExpression.node.callee.object.type === 'ThisExpression' &&
				pathExpression.node.callee.property.type === 'Identifier' &&
				pathExpression.node.callee.property.name === '$emit'
			) {
				const args = pathExpression.node.arguments
				if (!args.length) {
					return false
				}
				// fetch the leading comments on the wrapping expression
				const docblock = getDocblock(pathExpression.parentPath)
				const doclets = getDoclets(docblock || '')
				let eventName: string
				const eventTags = doclets.tags ? doclets.tags.filter(d => d.title === 'event') : []

				// if someone wants to document it with anything else, they can force it
				if (eventTags.length) {
					eventName = (eventTags[0] as Tag).content as string
				} else {
					let firstArg = pathExpression.get('arguments', 0)
					if (bt.isIdentifier(firstArg.node)) {
						firstArg = resolveIdentifier(astPath, firstArg)
					}

					if (!firstArg || !bt.isStringLiteral(firstArg.node)) {
						return false
					}
					eventName = firstArg.node.value
				}

				// if this event is documented somewhere else leave it alone
				const evtDescriptor = documentation.getEventDescriptor(eventName)

				setEventDescriptor(evtDescriptor, doclets)

				if (args.length > 1 && !evtDescriptor.type) {
					evtDescriptor.type = {
						names: ['undefined']
					}
				}

				if (args.length > 2 && !evtDescriptor.properties) {
					evtDescriptor.properties = []
				}
				if (evtDescriptor.properties && evtDescriptor.properties.length < args.length - 2) {
					let i = args.length - 2 - evtDescriptor.properties.length
					while (i--) {
						evtDescriptor.properties.push({
							type: { names: ['undefined'] },
							name: `<anonymous${args.length - i - 2}>`
						})
					}
				}
				return false
			}
			this.traverse(pathExpression)
			return undefined
		}
	})
	return Promise.resolve()
}

/**
 * Extracts events information from an
 * object-style VueJs component `emits` option
 *
 * @param documentation
 * @param path
 */
export function eventHandlerEmits(documentation: Documentation, path: NodePath) {
	const emitsPath = path
		.get('properties')
		.filter(
			(p: NodePath) => bt.isObjectProperty(p.node) && getMemberFilter('emits')(p)
		) as NodePath<bt.ObjectProperty>[]

	// if no emits member return
	if (!emitsPath.length) {
		return
	}
	const emitsObject = emitsPath[0].get('value')
	if (bt.isArrayExpression(emitsObject.node)) {
		emitsObject.get('elements').value.forEach((event: bt.Node, i: number) => {
			if (bt.isStringLiteral(event)) {
				const eventDescriptor = documentation.getEventDescriptor(event.value)
				const eventPath = emitsObject.get('elements', i)
				const docblock = getDocblock(eventPath)
				const doclets = getDoclets(docblock || '')
				setEventDescriptor(eventDescriptor, doclets)
			}
		})
	} else if (bt.isObjectExpression(emitsObject.node)) {
		emitsObject.get('properties').value.forEach((event: bt.ObjectProperty, i: number) => {
			const eventName = bt.isStringLiteral(event.key)
				? event.key.value
				: bt.isIdentifier(event.key)
				? event.key.name
				: undefined

			if (eventName) {
				const eventDescriptor = documentation.getEventDescriptor(eventName)
				const eventPath = emitsObject.get('properties', i)
				const docblock = getDocblock(eventPath)
				const doclets = getDoclets(docblock || '')
				setEventDescriptor(eventDescriptor, doclets)
			}
		})
	}
}

/**
 * Extracts events information from an
 * object-style VueJs component `methods` option
 *
 * @param documentation
 * @param path
 */
export function eventHandlerMethods(documentation: Documentation, path: NodePath) {
	const methodsPath = path
		.get('properties')
		.filter(
			(p: NodePath) => bt.isObjectProperty(p.node) && getMemberFilter('methods')(p)
		) as NodePath<bt.ObjectProperty>[]

	// if no method return
	if (!methodsPath.length) {
		return
	}

	const methodsObject = methodsPath[0].get('value')
	if (bt.isObjectExpression(methodsObject.node)) {
		methodsObject.get('properties').each((p: NodePath) => {
			const commentedMethod = bt.isObjectMethod(p.node) ? p : p.parentPath
			const { tags: jsDocTags } = getCommentBlockAndTags(commentedMethod) || {}

			if (!jsDocTags) {
				return
			}

			const firesTags = jsDocTags.filter(tag => tag.title === 'fires') as Tag[]
			firesTags.forEach(tag => {
				const eventName = tag.content as string
				const eventDescriptor = documentation.getEventDescriptor(eventName)
				let currentBlock: DocBlockTags | null
				let foundEventDescriptor: DocBlockTags | undefined
				let commentIndex = 1
				do {
					currentBlock = getCommentBlockAndTags(commentedMethod, { commentIndex: ++commentIndex })
					if (
						currentBlock &&
						currentBlock.tags &&
						currentBlock.tags.some((tag: Tag) => tag.title === 'event' && tag.content === eventName)
					) {
						foundEventDescriptor = currentBlock
					}
				} while (currentBlock && !foundEventDescriptor)

				if (foundEventDescriptor) {
					setEventDescriptor(eventDescriptor, foundEventDescriptor)
				}
			})
		})
	}
}

/**
 * Accepted tags for conveying event properties
 */
const PROPERTY_TAGS = ['property', 'arg', 'arguments', 'param']

export function setEventDescriptor(
	eventDescriptor: EventDescriptor,
	jsDoc: DocBlockTags
): EventDescriptor {
	if (jsDoc.description && jsDoc.description.length) {
		eventDescriptor.description = jsDoc.description
	}

	const nonNullTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : []

	const typeTags = nonNullTags.filter(tg => tg.title === 'type')
	eventDescriptor.type = typeTags.length
		? { names: typeTags.map((t: TypedParamTag) => t.type.name) }
		: eventDescriptor.type

	const propertyTags = nonNullTags.filter(tg => PROPERTY_TAGS.includes(tg.title))
	if (propertyTags.length) {
		eventDescriptor.properties = propertyTags.map((tg: TypedParamTag) => {
			return { type: { names: [tg.type.name] }, name: tg.name, description: tg.description }
		})
	}

	// remove the property an type tags from the tag array
	const tags = nonNullTags.filter(
		(tg: BlockTag) => tg.title !== 'type' && tg.title !== 'property' && tg.title !== 'event'
	)

	if (tags.length) {
		eventDescriptor.tags = tags
	} else {
		delete eventDescriptor.tags
	}

	return eventDescriptor
}
