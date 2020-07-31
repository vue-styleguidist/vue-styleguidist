import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import Documentation from '../Documentation'
import getProperties from './utils/getProperties'

/**
 * Extracts component name from an object-style VueJs component
 * @param documentation
 * @param path
 */
export default async function displayNameHandler(documentation: Documentation, compDef: NodePath) {
	if (bt.isObjectExpression(compDef.node)) {
		const namePath = getProperties(compDef, 'name')

		// if no prop return
		if (!namePath.length) {
			return
		}

		const nameValuePath = namePath[0].get('value')
		const singleNameValuePath = !Array.isArray(nameValuePath) ? nameValuePath : null

		let displayName: string | null = null
		if (singleNameValuePath) {
			if (bt.isStringLiteral(singleNameValuePath.node)) {
				displayName = singleNameValuePath.node.value
			} else if (bt.isIdentifier(singleNameValuePath.node)) {
				const nameConstId = singleNameValuePath.node.name
				const program = compDef.parentPath.parentPath as NodePath<bt.Program>
				if (program.name === 'body') {
					displayName = getDeclaredConstantValue(program, nameConstId)
				}
			}
		}
		documentation.set('displayName', displayName)
	}
}

function getDeclaredConstantValue(prog: NodePath<bt.Program>, nameConstId: string): string | null {
	const body = prog.node.body
	const globalVariableDeclarations = body.filter((node: bt.Node) =>
		bt.isVariableDeclaration(node)
	) as bt.VariableDeclaration[]
	const declarators = globalVariableDeclarations.reduce(
		(a: bt.VariableDeclarator[], declPath) => a.concat(declPath.declarations),
		[]
	)
	const nodeDeclaratorArray = declarators.filter(
		d => bt.isIdentifier(d.id) && d.id.name === nameConstId
	)
	const nodeDeclarator = nodeDeclaratorArray.length ? nodeDeclaratorArray[0] : undefined
	return nodeDeclarator && nodeDeclarator.init && bt.isStringLiteral(nodeDeclarator.init)
		? nodeDeclarator.init.value
		: null
}
