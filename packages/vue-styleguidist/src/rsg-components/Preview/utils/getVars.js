import walkes from 'walkes'
import getAst from './getAst'

/**
 * extract variable and function declaration from a code
 * @param {code} String code
 * @return {varNames} Array<String>
 */
export default code => {
	const varNames = []
	walkes(getAst(code), {
		VariableDeclaration(node) {
			node.declarations.forEach(declaration => {
				if (declaration.id.name) {
					// simple variable declaration
					varNames.push(declaration.id.name)
				} else if (declaration.id.properties) {
					// spread variable declaration
					// const { all:names } = {all: 'foo'}
					declaration.id.properties.forEach(p => {
						varNames.push(p.value.name)
					})
				}
			})
		},
		FunctionDeclaration(node) {
			varNames.push(node.id.name)
		}
	})
	return varNames
}
