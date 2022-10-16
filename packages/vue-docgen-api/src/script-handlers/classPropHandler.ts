import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import Documentation, { BlockTag, DocBlockTags, ParamType } from '../Documentation'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'
import getTypeFromAnnotation from '../utils/getTypeFromAnnotation'
import transformTagsIntoObject from '../utils/transformTagsIntoObject'
import propHandler, {
	describeDefault,
	describeRequired,
	describeType,
	extractValuesFromTags,
	getTypeFromTypePath,
	getValuesFromTypeAnnotation
} from './propHandler'
import getArgFromDecorator from '../utils/getArgFromDecorator'
import { ParseOptions } from '../parse'

/**
 * Extracts prop information from a class-style VueJs component
 * @param documentation
 * @param path
 */
export default async function classPropHandler(
	documentation: Documentation,
	path: NodePath<bt.ClassDeclaration>,
	ast: bt.File,
	opt: ParseOptions
): Promise<void> {
	if (bt.isClassDeclaration(path.node)) {
		const config = getArgFromDecorator(path.get('decorators') as NodePath<bt.Decorator>)

		if (config && bt.isObjectExpression(config.node)) {
			await propHandler(documentation, config, ast, opt)
		}

		path
			.get('body')
			.get('body')
			.filter((p: NodePath) => bt.isClassProperty(p.node) && !!p.node.decorators)
			.forEach((propPath: NodePath<bt.ClassProperty>) => {
				const propDeco = (propPath.get('decorators') || []).filter((p: NodePath<bt.Decorator>) => {
					const exp = bt.isCallExpression(p.node.expression)
						? p.node.expression.callee
						: p.node.expression
					return bt.isIdentifier(exp) && exp.name === 'Prop'
				})

				if (!propDeco.length) {
					return undefined
				}

				const propName = bt.isIdentifier(propPath.node.key) ? propPath.node.key.name : undefined
				if (!propName) {
					return undefined
				}

				const propDescriptor = documentation.getPropDescriptor(propName)

				// description
				const docBlock = getDocblock(propPath)
				const jsDoc: DocBlockTags = docBlock ? getDoclets(docBlock) : { description: '', tags: [] }
				const jsDocTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : []
				if (jsDocTags) {
					propDescriptor.tags = transformTagsIntoObject(jsDocTags)
				}
				if (jsDoc.description) {
					propDescriptor.description = jsDoc.description
				}

				extractValuesFromTags(propDescriptor)
				let litteralType: string | undefined
				if (propPath.node.typeAnnotation) {
					const values =
						!!bt.isTSTypeAnnotation(propPath.node.typeAnnotation) &&
						getValuesFromTypeAnnotation(propPath.node.typeAnnotation.typeAnnotation)
					if (values) {
						propDescriptor.values = values
						propDescriptor.type = { name: 'string' }
						litteralType = 'string'
					} else {
						// type
						propDescriptor.type = getTypeFromAnnotation(propPath.node.typeAnnotation)
					}
				} else if (propPath.node.value) {
					propDescriptor.type = getTypeFromInitValue(propPath.node.value)
				}

				const propDecoratorPath = propDeco[0].get('expression')
				if (bt.isCallExpression(propDecoratorPath.node)) {
					const propDecoratorArg = propDecoratorPath.get('arguments', 0)

					if (propDecoratorArg) {
						if (bt.isObjectExpression(propDecoratorArg.node)) {
							const propsPath = propDecoratorArg
								.get('properties')
								.filter((p: NodePath) =>
									bt.isObjectProperty(p.node)
								) as NodePath<bt.ObjectProperty>[]

							// if there is no type annotation, get it from the decorators arguments
							if (!propPath.node.typeAnnotation) {
								litteralType = describeType(propsPath, propDescriptor)
							}
							describeDefault(propsPath, propDescriptor, litteralType || '')
							describeRequired(propsPath, propDescriptor)
							// this compares the node to its supposed args
							// if it finds no args it will return itself
						} else if (propDecoratorArg.node !== propDecoratorPath.node) {
							propDescriptor.type = getTypeFromTypePath(propDecoratorArg)
						}
					}
				}
				return undefined
			})
	}
	return Promise.resolve()
}

function getTypeFromInitValue(node: any): ParamType | undefined {
	if (bt.isNumericLiteral(node)) {
		return { name: 'number' }
	}
	if (bt.isStringLiteral(node) || bt.isTemplateLiteral(node)) {
		return { name: 'string' }
	}
	if (bt.isBooleanLiteral(node)) {
		return { name: 'boolean' }
	}
	return undefined
}
