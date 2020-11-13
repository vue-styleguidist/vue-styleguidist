import walkes from 'walkes'
import getAst from './getAst'
import transformOneImport from './transformOneImport'

export default function transformScript(
	code: string,
	transform: (code?: string) => string | undefined = c => c
): string {
	let offset = 0
	let compiledCode = transform(code) || code
	const ast = getAst(compiledCode)
	const varNames: string[] = []
	walkes(ast, {
		// transform all imports into require function calls
		ImportDeclaration(node: any) {
			const ret = transformOneImport(node, compiledCode, offset)
			offset = ret.offset
			compiledCode = ret.code
			if (node.specifiers) {
				node.specifiers.forEach((s: any) => varNames.push(s.local.name))
			}
		},
		VariableDeclaration(node: any) {
			node.declarations.forEach((declaration: any) => {
				if (declaration.id.name) {
					// simple variable declaration
					varNames.push(declaration.id.name)
				} else if (declaration.id.properties) {
					// spread variable declaration
					// const { all:names } = {all: 'foo'}
					declaration.id.properties.forEach((p: any) => {
						varNames.push(p.value.name)
					})
				}
			})
		},
		FunctionDeclaration(node: any) {
			varNames.push(node.id.name)
		}
	})
	return `${compiledCode};return {data:function(){return {${
		// add local vars in data
		// this is done through an object like {varName: varName}
		// since each varName is defined in compiledCode, it can be used to init
		// the data object here
		varNames.map(varName => `${varName}:${varName}`).join(',')
	}};}}`
}
