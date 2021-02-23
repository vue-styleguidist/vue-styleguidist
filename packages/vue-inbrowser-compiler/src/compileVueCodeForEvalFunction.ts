/* eslint-disable no-case-declarations */
import { isCodeVueSfc } from 'vue-inbrowser-compiler-utils'
import {
	transpileModule,
	TranspileOptions,
	forEachChild,
	Node,
	isNewExpression,
	isExpressionStatement,
	isImportDeclaration,
	isFunctionDeclaration,
	isIdentifier,
	isVariableStatement,
	isVariableDeclaration,
	isObjectBindingPattern,
	isBindingElement,
	isNamedImports,
	isObjectLiteralExpression,
	JsxEmit
} from 'typescript'
import transformOneImport from './transformOneImport'
import normalizeSfcComponent, {
	parseScriptCode,
	getRenderFunctionStart,
	insertCreateElementFunction,
	JSX_ADDON_LENGTH
} from './normalizeSfcComponent'
import getAst from './getAst'
import getTargetFromBrowser from './getTargetFromBrowser'

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
	config: TranspileOptions & { jsx?: string } = {}
): EvaluableComponent {
	const nonCompiledComponent = prepareVueCodeForEvalFunction(code, config)
	const target = typeof window !== 'undefined' ? getTargetFromBrowser() : undefined
	if (config.jsx && !config.compilerOptions?.jsxFactory) {
		config.compilerOptions = config.compilerOptions || {}
		config.compilerOptions.jsxFactory = config.jsx
		config.compilerOptions.jsx = JsxEmit.React
		delete config.jsx
	}

	const result = transpileModule(nonCompiledComponent.script, {
		compilerOptions: { target, ...config.compilerOptions },
		...config
	})

	return {
		...nonCompiledComponent,
		script: result.outputText
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
	walkesNode(ast)

	function walkesNode(node: Node) {
		if (
			isExpressionStatement(node) &&
			isNewExpression(node.expression) &&
			isIdentifier(node.expression.expression) &&
			node.expression.expression.text === 'Vue'
		) {
			// replace `new Vue({data})` by `return {data}`
			const before = code.slice(0, node.expression.pos + offset)
			const optionsNode = node.expression?.arguments?.[0]
			if (!optionsNode || !isObjectLiteralExpression(optionsNode)) {
				return
			}
			const renderIndex = getRenderFunctionStart(optionsNode)

			let endIndex = optionsNode?.end || 0
			if (renderIndex > 0) {
				code = insertCreateElementFunction(
					code.slice(0, renderIndex + 1),
					code.slice(renderIndex + 1)
				)
				endIndex += JSX_ADDON_LENGTH
			}
			const after = optionsNode ? code.slice(optionsNode.pos + offset, endIndex + offset) : ''
			code = before + ';return ' + after

			return
		} else if (isImportDeclaration(node)) {
			const ret = transformOneImport(node, code, offset)
			offset = ret.offset
			code = ret.code
			const bindings = node.importClause?.namedBindings
			if (vsgMode && bindings && isNamedImports(bindings)) {
				bindings.elements.forEach(elt => {
					const internalVarName = elt.propertyName ?? elt.name
					varNames.push(internalVarName.text)
				})
			}
			return
		} else if (vsgMode && isVariableStatement(node)) {
			node.declarationList.declarations.forEach(declaration => {
				if (isVariableDeclaration(declaration) && isIdentifier(declaration.name)) {
					// simple variable declaration
					varNames.push(declaration.name.text)
				} else if (isVariableDeclaration(declaration) && isObjectBindingPattern(declaration.name)) {
					// spread variable declaration
					// const { all:names } = {all: 'foo'}
					declaration.name.elements.forEach(e => {
						if (isBindingElement(e) && isIdentifier(e.name)) {
							varNames.push(e.name.text)
						}
					})
				}
			})
			return
		} else if (vsgMode && isFunctionDeclaration(node)) {
			if (node.name && isIdentifier(node.name)) {
				varNames.push(node.name.text)
			}
			return
		}
		forEachChild(node, walkesNode)
	}

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
