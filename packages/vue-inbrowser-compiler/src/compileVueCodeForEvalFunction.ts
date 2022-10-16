import { transform, TransformOptions } from 'buble'
import walkes from 'walkes'
import {
	EvaluableComponent,
	isCodeVueSfc,
	isVue3,
	compileTemplateForEval
} from 'vue-inbrowser-compiler-utils'
import transformOneImport from './transformOneImport'
import normalizeSfcComponent, {
	parseScriptCode,
	getRenderFunctionStart,
	insertCreateElementFunction,
	JSX_ADDON_LENGTH
} from './normalizeSfcComponent'
import getAst from './getAst'
import getTargetFromBrowser from './getTargetFromBrowser'

interface EvaluableComponentWithSource extends EvaluableComponent {
	raw: {
		script: string
		template?: string
	}
}

/**
 * Reads the code as a string, separates the javascript part from the template & style parts,
 * then replaces the imports with requires and returns the script code as the body of a function.
 *
 * - For Vue2 the function compiles the template into a render function and adds the new function to the evaluated code.
 * - For Vue3 you have to use the compileVue3Template function yourself to compile the template into a function.
 * @param code
 * @param config buble config to be used when transforming
 *
 */
export default function compileVueCodeForEvalFunction(
	code: string,
	config: TransformOptions = {}
): EvaluableComponentWithSource {
	const nonCompiledComponent = prepareVueCodeForEvalFunction(code, config)
	const target = typeof window !== 'undefined' ? getTargetFromBrowser() : {}

	const compiledComponent = {
		...nonCompiledComponent,
		script: transform(nonCompiledComponent.script, { target, ...config }).code
	}

	compileTemplateForEval(compiledComponent)

	return {
		...compiledComponent,
		raw: nonCompiledComponent
	}
}

function prepareVueCodeForEvalFunction(code: string, config: any): EvaluableComponent {
	let style
	let vsgMode = false
	let template

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
				script: `${preprocessing};return {${component}};${postprocessing}`
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
				if (renderIndex > 0 && !isVue3) {
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
