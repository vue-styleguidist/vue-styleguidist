import { transform } from 'buble'
import walkes from 'walkes'
import { isCodeVueSfc } from 'vue-inbrowser-compiler-utils'
import transformOneImport from './transformOneImport'
import normalizeSfcComponent, {
	parseScriptCode,
	getRenderFunctionStart,
	insertCreateElementFunction,
	JSX_ADDON_LENGTH
} from './normalizeSfcComponent'
import getAst from './getAst'

interface EvaluableComponent {
	script: string
	template?: string
	style?: string
}

/**
 * Reads the code in string and separates the javascript part and the html part
 * then sets the nameVarComponent variable with the value of the component parameters
 * @param code
 * @param config buble config to be used when transforming
 *
 */
export default function compileVueCodeForEvalFunction(
	code: string,
	config: any = {}
): EvaluableComponent {
	const nonCompiledComponent = prepareVueCodeForEvalFunction(code, config)
	return {
		...nonCompiledComponent,
		script: transform(nonCompiledComponent.script, config).code
	}
}

function prepareVueCodeForEvalFunction(code: string, config: any): EvaluableComponent {
	let style,
		vsgMode = false,
		template

	// if the component is written as a Vue sfc,
	// transform it in to a "return"
	// even if jsx is used in an sfc we still use this use case
	if (isCodeVueSfc(code)) {
		return normalizeSfcComponent(code)
	}

	// if it's not a new Vue, it must be a simple template or a vsg format
	// lets separate the template from the script
	if (!/new Vue\(/.test(code)) {
		// this for jsx examples without the SFC shell
		// export default {render: (h) => <Button>}
		if (config.jsx) {
			const { preprocessing, component, postprocessing } = parseScriptCode(code)
			return {
				script: `${preprocessing};\nreturn {${component}};\n${postprocessing}`
			}
		}

		const findStartTemplateMatch = /^\W*</.test(code) ? { index: 0 } : code.match(/\n[\t ]*</)
		const limitScript =
			findStartTemplateMatch && findStartTemplateMatch.index !== undefined
				? findStartTemplateMatch.index
				: -1
		template = limitScript > -1 ? code.slice(limitScript) : undefined
		code = limitScript > -1 ? code.slice(0, limitScript) : code
		vsgMode = true
	}
	const ast = getAst(code)
	let offset = 0
	const varNames: string[] = []
	walkes(ast, {
		// replace `new Vue({data})` by `return {data}`
		ExpressionStatement(node: any) {
			if (node.expression.type === 'NewExpression' && node.expression.callee.name === 'Vue') {
				const before = code.slice(0, node.expression.start + offset)
				const optionsNode =
					node.expression.arguments && node.expression.arguments.length
						? node.expression.arguments[0]
						: undefined
				const renderIndex = getRenderFunctionStart(optionsNode)
				let endIndex = optionsNode.end
				if (renderIndex > 0) {
					code = insertCreateElementFunction(
						code.slice(0, renderIndex + 1),
						code.slice(renderIndex + 1)
					)
					endIndex += JSX_ADDON_LENGTH
				}
				const after = optionsNode ? code.slice(optionsNode.start + offset, endIndex + offset) : ''
				code = before + ';return ' + after
			}
		},
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
	return {
		script: code,
		style,
		template
	}
}
