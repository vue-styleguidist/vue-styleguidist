import walkes from 'walkes'
import getAst from './getAst'

export default function getImports(code: string): string[] {
	const imports: string[] = []
	try {
		const ast = getAst(code)
		walkes(ast, {
			ImportDeclaration(node: any) {
				imports.push(node.source.value)
			},
			CallExpression(node: any) {
				if (node.callee.name === 'require' && node.arguments[0].value) {
					imports.push(node.arguments[0].value)
				}
			}
		})
		return imports
	} catch (e) {
		return []
	}
}
