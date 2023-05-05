import { transform, Options as TransformOptions } from 'sucrase'
import walkes from 'walkes'
import { isCodeVueSfc, isVue3, compileTemplateForEval, compileTemplateForEvalSetup, EvaluableComponent } from 'vue-inbrowser-compiler-utils'
import normalizeSfcComponent, {
	parseScriptCode,
	getRenderFunctionStart,
	insertCreateElementFunction,
	JSX_ADDON_LENGTH,
	
} from './normalizeSfcComponent'
import getAst from './getAst'

interface EvaluableComponentWithSource extends EvaluableComponent {
	raw: {
		script: string
		template?: string
	}
}

export function compileVue3Template(template: string, component: any): () => any {
	return () => ({})
}

/**
 * Reads the code in string and separates the javascript part and the html part
 * then sets the nameVarComponent variable with the value of the component parameters
 * @param code
 * @param config sucrase config to be used when transforming
 *
 */
export default function compileVueCodeForEvalFunction(
	code: string,
	config: Omit<TransformOptions, 'transforms'> & { objectAssign?: string } = {},
  scopeId?: string
): EvaluableComponentWithSource {
	const nonCompiledComponent = prepareVueCodeForEvalFunction(code, config)
	const configWithTransforms: TransformOptions = {
		production: true,
		jsxPragma: config.jsxPragma,
		jsxFragmentPragma: config.jsxFragmentPragma,
		transforms: ['typescript', 'imports', ...(config.jsxPragma ? (['jsx'] as const) : [])]
	}

	const compiledComponent = {
		...nonCompiledComponent,
    scopeId,
		script: transform(nonCompiledComponent.script, configWithTransforms).code
	}

	if(nonCompiledComponent.setup && isVue3) {
		compileTemplateForEvalSetup(compiledComponent, code)
	} else {
		compileTemplateForEval(compiledComponent)
	}

	return {
		...compiledComponent,
		raw: nonCompiledComponent
	}
}

function prepareVueCodeForEvalFunction(
	code: string,
	config: { jsxPragma?: string; objectAssign?: string }
): EvaluableComponent {
	let style
	let vsgMode = false
	let template

	// if the component is written as a Vue sfc,
	// transform it in to a "return"
	// even if jsx is used in an sfc we still use this use case
	if (isCodeVueSfc(code)) {
		return normalizeSfcComponent(code, config)
	}

	// if it's not a new Vue, it must be a simple template or a vsg format
	// lets separate the template from the script
	if (!/new Vue\(/.test(code)) {
		// this for jsx examples without the SFC shell
		// export default {render: (h) => <Button>}
		if (config.jsxPragma) {
			const { preprocessing, component } = parseScriptCode(code, config)
			return {
				script: `${preprocessing};return {${component}};`,
				setup: false
			}
		}

		const findStartTemplateMatch = /^[\t ]*</.test(code) ? { index: -1 } : code.match(/\n[\t ]*</)
		const limitScript =
			findStartTemplateMatch && findStartTemplateMatch.index !== undefined
				? findStartTemplateMatch.index + 1 // we don't want to count the \n in there
				: -1
		template = limitScript > -1 ? code.slice(limitScript) : undefined
		code = limitScript > -1 ? code.slice(0, limitScript) : code
		vsgMode = true
	}
  
	const ast = getAst(code)
	let offset = 0
	const varNames: string[] = []
	walkes(ast.program, {
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
		template: isVue3 || !template ? template : `<div>${template}</div>`,
		setup: false
	}
}
