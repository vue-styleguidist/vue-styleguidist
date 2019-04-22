import { parse } from 'acorn'

/**
 * extract variable and function declaration from a code
 * @param {code} syntaxTree
 */
export default code => {
	const syntaxTree = parse(code)
	const arr = syntaxTree.body.filter(syntax => {
		return syntax.type === 'VariableDeclaration' || syntax.type === 'FunctionDeclaration'
	})
	arr.unshift([])
	return arr.reduce((total, next) => {
		function getId(syntax) {
			if (syntax.declarations) {
				return Array.prototype.concat.apply(
					[],
					syntax.declarations.map(declaration => declaration.id.name)
				)
			}
			return [syntax.id.name]
		}
		total = total.concat(getId(next))
		return total
	})
}
