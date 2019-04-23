import { parse } from 'acorn'
import walkes from 'walkes'

/**
 * extract variable and function declaration from a code
 * @param {code} String code
 * @return {varNames} Array<String>
 */
export default code => {
	const varNames = []
	walkes(parse(code), {
		VariableDeclaration(node) {
			node.declarations.forEach(declaration => {
				varNames.push(declaration.id.name)
			})
		},
		FunctionDeclaration(node) {
			varNames.push(node.id.name)
		}
	})
	return varNames
}
