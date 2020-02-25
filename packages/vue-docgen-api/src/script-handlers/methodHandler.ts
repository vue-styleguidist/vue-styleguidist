import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import Documentation, {
	BlockTag,
	DocBlockTags,
	MethodDescriptor,
	Param,
	ParamTag,
	Tag
} from '../Documentation'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'
import getTypeFromAnnotation from '../utils/getTypeFromAnnotation'
import transformTagsIntoObject from '../utils/transformTagsIntoObject'
import getMemberFilter from '../utils/getPropsFilter'

export default async function methodHandler(documentation: Documentation, path: NodePath) {
	if (bt.isObjectExpression(path.node)) {
		const methodsPath = path
			.get('properties')
			.filter(
				(p: NodePath) => bt.isObjectProperty(p.node) && getMemberFilter('methods')(p)
			) as Array<NodePath<bt.ObjectProperty>>

		// if no method return
		if (!methodsPath.length) {
			return
		}

		const methodsObject = methodsPath[0].get('value')
		if (bt.isObjectExpression(methodsObject.node)) {
			methodsObject.get('properties').each((p: NodePath) => {
				let methodName = '<anonymous>'
				if (bt.isObjectProperty(p.node)) {
					const val = p.get('value')
					methodName = p.node.key.name
					if (!Array.isArray(val)) {
						p = val
					}
				}
				methodName = bt.isObjectMethod(p.node) ? p.node.key.name : methodName

				const docBlock = getDocblock(bt.isObjectMethod(p.node) ? p : p.parentPath)

				const jsDoc: DocBlockTags = docBlock ? getDoclets(docBlock) : { description: '', tags: [] }
				const jsDocTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : []

				// ignore the method if there is no public tag
				if (!jsDocTags.some((t: Tag) => t.title === 'access' && t.content === 'public')) {
					return
				}

				const methodDescriptor = documentation.getMethodDescriptor(methodName)

				if (jsDoc.description) {
					methodDescriptor.description = jsDoc.description
				}
				setMethodDescriptor(methodDescriptor, p as NodePath<bt.Function>, jsDocTags)
			})
		}
	}
}

export function setMethodDescriptor(
	methodDescriptor: MethodDescriptor,
	method: NodePath<bt.Function>,
	jsDocTags: BlockTag[]
) {
	// params
	describeParams(
		method,
		methodDescriptor,
		jsDocTags.filter(tag => ['param', 'arg', 'argument'].indexOf(tag.title) >= 0)
	)

	// returns
	describeReturns(method, methodDescriptor, jsDocTags.filter(t => t.title === 'returns'))

	// tags
	methodDescriptor.tags = transformTagsIntoObject(jsDocTags)

	return methodDescriptor
}

function describeParams(
	methodPath: NodePath<bt.Function>,
	methodDescriptor: MethodDescriptor,
	jsDocParamTags: ParamTag[]
) {
	// if there is no parameter no need to parse them
	const fExp = methodPath.node
	if (!fExp.params.length && !jsDocParamTags.length) {
		return
	}

	const params: Param[] = []
	fExp.params.forEach((par: bt.Identifier | bt.AssignmentPattern, i) => {
		let name: string
		if (bt.isIdentifier(par)) {
			// simple params
			name = par.name
		} else if (bt.isIdentifier(par.left)) {
			// es6 default params
			name = par.left.name
		} else {
			// unrecognized pattern
			return
		}

		const jsDocTags = jsDocParamTags.filter(tag => tag.name === name)
		let jsDocTag = jsDocTags.length ? jsDocTags[0] : undefined

		// if tag is not namely described try finding it by its order
		if (!jsDocTag) {
			if (jsDocParamTags[i] && !jsDocParamTags[i].name) {
				jsDocTag = jsDocParamTags[i]
			}
		}

		const param: Param = { name }
		if (jsDocTag) {
			if (jsDocTag.type) {
				param.type = jsDocTag.type
			}
			if (jsDocTag.description) {
				param.description = jsDocTag.description
			}
		}

		if (!param.type && par.typeAnnotation) {
			const type = getTypeFromAnnotation(par.typeAnnotation)
			if (type) {
				param.type = type
			}
		}

		params.push(param)
	})

	// in case the arguments are abstracted (using the arguments keyword)
	if (!params.length) {
		jsDocParamTags.forEach(doc => {
			params.push(doc)
		})
	}

	if (params.length) {
		methodDescriptor.params = params
	}
}

function describeReturns(
	methodPath: NodePath<bt.Function>,
	methodDescriptor: MethodDescriptor,
	jsDocReturnTags: ParamTag[]
) {
	if (jsDocReturnTags.length) {
		methodDescriptor.returns = jsDocReturnTags[0]
	}

	if (!methodDescriptor.returns || !methodDescriptor.returns.type) {
		const methodNode = methodPath.node
		if (methodNode.returnType) {
			const type = getTypeFromAnnotation(methodNode.returnType)
			if (type) {
				methodDescriptor.returns = methodDescriptor.returns || {}
				methodDescriptor.returns.type = type
			}
		}
	}
}
