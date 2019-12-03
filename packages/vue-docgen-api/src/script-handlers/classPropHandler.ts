import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import Documentation, { BlockTag, DocBlockTags } from '../Documentation'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'
import getTypeFromAnnotation from '../utils/getTypeFromAnnotation'
import transformTagsIntoObject from '../utils/transformTagsIntoObject'
import propHandler, {
	describeDefault,
	describeRequired,
	describeType,
	extractValuesFromTags
} from './propHandler'
import getArgFromDecorator from '../utils/getArgFromDecorator'

export default async function classPropHandler(
	documentation: Documentation,
	path: NodePath<bt.ClassDeclaration>
) {
	if (bt.isClassDeclaration(path.node)) {
		const config = getArgFromDecorator(path.get('decorators') as NodePath<bt.Decorator>)

		if (config && bt.isObjectExpression(config.node)) {
			propHandler(documentation, config)
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
					return
				}

				const propName = bt.isIdentifier(propPath.node.key) ? propPath.node.key.name : undefined
				if (!propName) {
					return
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

				if (propPath.node.typeAnnotation) {
					propDescriptor.type = getTypeFromAnnotation(propPath.node.typeAnnotation)
				}

				const propDecoratorPath = propDeco[0].get('expression')
				if (bt.isCallExpression(propDecoratorPath.node)) {
					const propDecoratorArg = propDecoratorPath.get('arguments', 0)

					if (propDecoratorArg && bt.isObjectExpression(propDecoratorArg.node)) {
						const propsPath = propDecoratorArg
							.get('properties')
							.filter((p: NodePath) => bt.isObjectProperty(p.node)) as Array<
							NodePath<bt.ObjectProperty>
						>
						// if there is no type annotation, get it from the decorators arguments
						if (!propPath.node.typeAnnotation) {
							describeType(propsPath, propDescriptor)
						}
						describeDefault(propsPath, propDescriptor)
						describeRequired(propsPath, propDescriptor)
					}
				}
			})
	}
}
