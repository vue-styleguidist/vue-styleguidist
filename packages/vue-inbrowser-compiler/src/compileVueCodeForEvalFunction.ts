import { isCodeVueSfc } from 'vue-inbrowser-compiler-utils'
import normalizeSfcComponent, { parseScriptCode } from './normalizeSfcComponent'
import JSXTransform from './jsxTransform'
import getAst from './getAst'
import transformScript from './transformScript'

interface EvaluableComponent {
	script: string
	template?: string
	style?: string
	vsgMode?: boolean
}

/**
 * Reads the code in string and separates the javascript part and the html part
 * then sets the nameVarComponent variable with the value of the component parameters
 * @param code
 * @param config buble config to be used when transforming
 *
 */
export function compile(
	code: string,
	transform?: (input: string, ast: acorn.Node, offset: number) => { code: string; offset: number },
	jsx?: boolean
): EvaluableComponent {
	const nonCompiledComponent = prepareVueCodeForEvalFunction(code, jsx)
	const transformScriptComplete = (codeJSX: string, ast: acorn.Node, offset: number) => {
		const codeTransformed = transform
			? transform(codeJSX, ast, offset)
			: { code: codeJSX, offset: 1 }
		return transformScript(
			codeTransformed.code,
			ast,
			codeTransformed.offset,
			nonCompiledComponent.vsgMode || false
		)
	}
	const unCompiledScript = `()=>{${nonCompiledComponent.script}}`
	return {
		...nonCompiledComponent,
		script: transformScriptComplete(nonCompiledComponent.script, getAst(unCompiledScript), -4).code
	}
}

export function compileJSX(
	code: string,
	transform?: (input: string, ast: acorn.Node, offset: number) => { code: string; offset: number }
) {
	const transformJSX = (codeJSX: string, ast: acorn.Node, offset: number) => {
		const codeTransformed = transform
			? transform(codeJSX, ast, offset)
			: { code: codeJSX, offset: 1 }
		return JSXTransform(codeTransformed.code, ast, codeTransformed.offset)
	}
	return compile(code, transformJSX, true)
}

function prepareVueCodeForEvalFunction(code: string, jsx?: boolean): EvaluableComponent {
	let style

	// if the component is written as a Vue sfc,
	// transform it in to a "return"
	// even if jsx is used in an sfc we still use this use case
	if (isCodeVueSfc(code)) {
		return normalizeSfcComponent(code)
	}

	// if it's not a new Vue, it must be a simple template or a vsg format
	// lets separate the template from the script
	// this for jsx examples without the SFC shell
	// export default {render: (h) => <Button>}
	if (jsx) {
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
	const template = limitScript > -1 ? code.slice(limitScript) : undefined
	code = limitScript > -1 ? code.slice(0, limitScript) : code

	return {
		script: code,
		style,
		template,
		vsgMode: true
	}
}
