const { transform } = require('buble')
const walkes = require('walkes')
const normalizeSfcComponent = require('./normalizeSfcComponent')
const isCodeVueSfc = require('./isCodeVueSfc')
const getAst = require('./getAst')
const transformOneImport = require('./transformOneImport')

function transformBuble(code, config) {
	return transform(code, config).code
}

/**
 * Reads the code in string and separates the javascript part and the html part
 * then sets the nameVarComponent variable with the value of the component parameters
 * @param {string} code
 * @return {script:String, html:String}
 *
 */
module.exports = function compileVueCodeForEvalFunction(code, config) {
	let style, vsgMode, template
	if (isCodeVueSfc(code)) {
		const transformed = normalizeSfcComponent(code)
		code = transformed.component
		style = transformed.style
	}
	if (!/new Vue\(/.test(code)) {
		const findStartTemplateMatch = /^\W*</.test(code) ? { index: 0 } : code.match(/\n[\t ]*</)
		const limitScript = findStartTemplateMatch ? findStartTemplateMatch.index : -1
		template = limitScript > -1 ? code.slice(limitScript) : undefined
		code = limitScript > -1 ? code.slice(0, limitScript) : code
		vsgMode = true
	}
	const ast = getAst(code)
	let offset = 0
	const varNames = []
	walkes(ast, {
		// replace `new Vue({data})` by `return {data}`
		ExpressionStatement(node) {
			if (node.expression.type === 'NewExpression' && node.expression.callee.name === 'Vue') {
				const before = code.slice(0, node.expression.start)
				const optionsNode =
					node.expression.arguments && node.expression.arguments.length
						? node.expression.arguments[0]
						: undefined
				const after = optionsNode ? code.slice(optionsNode.start, optionsNode.end) : 'undefined'
				code = before + ';return ' + after
			}
		},
		// fix all imports into require function calls
		ImportDeclaration(node) {
			const ret = transformOneImport(node, code, offset)
			offset = ret.offset
			code = ret.code
		},
		...(vsgMode
			? {
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
	return {
		script: transformBuble(code, config),
		style,
		template
	}
}
