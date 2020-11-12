import walkes from 'walkes'
import transformOneImport from './transformOneImport'

export default function transformScript(
	code: string,
	ast: acorn.Node,
	offset: number,
	vsgMode: boolean
): { code: string; offset: number } {
	const varNames: string[] = []
	walkes(ast, {
		// transform all imports into require function calls
		ImportDeclaration(node: any) {
			const ret = transformOneImport(node, code, offset)
			offset = ret.offset
			code = ret.code
			if (vsgMode && node.specifiers) {
				node.specifiers.forEach((s: any) => varNames.push(s.local.name))
			}
		},
		...(vsgMode
			? {
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
			  }
			: {})
	})
	if (vsgMode) {
		code += `;return {data:function(){return {${
			// add local vars in data
			// this is done through an object like {varName: varName}
			// since each varName is defined in compiledCode, it can be used to init
			// the data object here
			varNames.map(varName => `${varName}:${varName}`).join(',')
		}};}}`
	}
	return { code, offset }
}
