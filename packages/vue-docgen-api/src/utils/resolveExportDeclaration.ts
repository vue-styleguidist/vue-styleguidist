import * as bt from '@babel/types'
import { NodePath } from 'ast-types/lib/node-path'
import Map from 'ts-map'

export default function resolveExportDeclaration(path: NodePath): Map<string, NodePath> {
	const definitions = new Map<string, NodePath>()
	if (bt.isExportDefaultDeclaration(path.node)) {
		const defaultPath = path as NodePath<bt.ExportDefaultDeclaration>
		definitions.set('default', defaultPath.get('declaration'))
	} else if (bt.isExportNamedDeclaration(path.node)) {
		const declaration = path.get('declaration')
		// export const example = {}
		if (declaration && bt.isVariableDeclaration(declaration.node)) {
			declaration.get('declarations').each((declarator: NodePath<bt.VariableDeclarator>) => {
				const nodeId = declarator.node.id
				if (bt.isIdentifier(nodeId)) {
					definitions.set(nodeId.name, declarator)
				}
			})
		} else {
			// const example = {}
			// export { example }
			getDefinitionsFromPathSpecifiers(path, definitions)
		}
	} else if (bt.isExportDeclaration(path.node)) {
		getDefinitionsFromPathSpecifiers(path, definitions)
	}
	return definitions
}

function getDefinitionsFromPathSpecifiers(path: NodePath, defs: Map<string, NodePath>) {
	const specifiersPath = path.get('specifiers')
	specifiersPath.each((specifier: NodePath<bt.ExportSpecifier | bt.ExportNamespaceSpecifier>) => {
		if (bt.isIdentifier(specifier.node.exported)) {
			defs.set(
				specifier.node.exported.name,
				bt.isExportSpecifier(specifier.node) ? specifier.get('local') : specifier.get('exported')
			)
		}
	})
}
