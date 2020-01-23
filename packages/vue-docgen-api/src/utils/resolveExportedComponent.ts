import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import recast from 'recast'
import Map from 'ts-map'
import isExportedAssignment from './isExportedAssignment'
import resolveExportDeclaration from './resolveExportDeclaration'
import resolveIdentifier from './resolveIdentifier'
import resolveRequired, { ImportedVariableSet } from './resolveRequired'

function ignore(): boolean {
	return false
}

/**
 * List of all keys that could contain documentation
 */
const VUE_COMPONENTS_KEYS = ['data', 'props', 'methods', 'computed']

function isObjectExpressionComponentDefinition(node: bt.ObjectExpression): boolean {
	return (
		// export const test = {}
		node.properties.length === 0 ||
		// export const compo = {data(){ return {cpm:"Button"}}
		node.properties.some(
			p =>
				(bt.isObjectMethod(p) || bt.isObjectProperty(p)) && VUE_COMPONENTS_KEYS.includes(p.key.name)
		)
	)
}

function isComponentDefinition(path: NodePath): boolean {
	const { node } = path

	return (
		// export default {} (always exported even when empty)
		bt.isObjectExpression(node) ||
		// export const myComp = {} (exported only when there is a componente definition or if empty)
		(bt.isVariableDeclarator(node) &&
			node.init &&
			bt.isObjectExpression(node.init) &&
			isObjectExpressionComponentDefinition(node.init)) ||
		// export default class MyComp extends VueComp
		bt.isClassDeclaration(node) ||
		// export default whatever.extend({})
		(bt.isCallExpression(node) && bt.isObjectExpression(node.arguments[0]))
	)
}

/**
 * Given an AST, this function tries to find the exported component definitions.
 *
 * If a definition is part of the following statements, it is considered to be
 * exported:
 *
 * modules.exports = Definition;
 * exports.foo = Definition;
 * export default Definition;
 * export var Definition = ...;
 */
export default function resolveExportedComponent(
	ast: bt.File
): [Map<string, NodePath>, ImportedVariableSet] {
	const components = new Map<string, NodePath>()
	const nonComponentsIdentifiers: string[] = []

	function setComponent(exportName: string, definition: NodePath) {
		if (definition && !components.get(exportName)) {
			components.set(exportName, normalizeComponentPath(definition))
		}
	}

	// function run for every non "assignment" export declaration
	// in extenso export default or export myvar
	function exportDeclaration(path: NodePath) {
		const definitions = resolveExportDeclaration(path)

		definitions.forEach((definition: NodePath, name: string) => {
			const realDef = resolveIdentifier(ast, definition)
			if (realDef) {
				if (isComponentDefinition(realDef)) {
					setComponent(name, realDef)
				}
			} else {
				nonComponentsIdentifiers.push(definition.value.name)
			}
		})
		return false
	}

	recast.visit(ast.program, {
		// for perf resons,
		// look only at the root,
		// ignore all traversing except for if
		visitFunctionDeclaration: ignore,
		visitFunctionExpression: ignore,
		visitClassDeclaration: ignore,
		visitClassExpression: ignore,
		visitWithStatement: ignore,
		visitSwitchStatement: ignore,
		visitWhileStatement: ignore,
		visitDoWhileStatement: ignore,
		visitForStatement: ignore,
		visitForInStatement: ignore,

		visitDeclareExportDeclaration: exportDeclaration,
		visitExportNamedDeclaration: exportDeclaration,
		visitExportDefaultDeclaration: exportDeclaration,

		visitAssignmentExpression(path: NodePath) {
			// function run on every assignments (with an =)

			// Ignore anything that is not `exports.X = ...;` or
			// `module.exports = ...;`
			if (!isExportedAssignment(path)) {
				return false
			}

			// Resolve the value of the right hand side. It should resolve to a call
			// expression, something like Vue.extend({})
			const pathRight = path.get('right')
			const pathLeft = path.get('left')
			const realComp = resolveIdentifier(ast, pathRight)

			const name =
				bt.isMemberExpression(pathLeft.node) &&
				bt.isIdentifier(pathLeft.node.property) &&
				pathLeft.node.property.name !== 'exports'
					? pathLeft.node.property.name
					: 'default'

			if (realComp) {
				if (isComponentDefinition(realComp)) {
					setComponent(name, realComp)
				}
			} else {
				nonComponentsIdentifiers.push(name)
			}

			return false
		}
	})

	const requiredValues = resolveRequired(ast, nonComponentsIdentifiers)

	return [components, requiredValues]
}

function normalizeComponentPath(path: NodePath): NodePath {
	if (bt.isObjectExpression(path.node)) {
		return path
	} else if (bt.isCallExpression(path.node)) {
		return path.get('arguments', 0)
	} else if (bt.isVariableDeclarator(path.node)) {
		return path.get('init')
	}
	return path
}
