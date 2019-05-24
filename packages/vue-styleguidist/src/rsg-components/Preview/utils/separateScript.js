import walkes from 'walkes'
import transformOneImport from './transformOneImport'
import normalizeSfcComponent from './normalizeSfcComponent'
import { isCodeVueSfc } from '../../../../loaders/utils/isCodeVueSfc'
import getAst from './getAst'

function transformImports(code) {
	let offset = 0
	walkes(getAst(code), {
		ImportDeclaration(node) {
			const ret = transformOneImport(node, code, offset)
			offset = ret.offset
			code = ret.code
		}
	})
	return code
}

/**
 * Reads the code in string and separates the javascript part and the html part
 * then sets the nameVarComponent variable with the value of the component parameters
 * @param {string} code
 * @return {script:String, html:String}
 *
 */
export default function separateScript(code, style) {
	let index = code.indexOf('new Vue')
	if (index > -1) {
		code = code.replace(/new Vue\(/g, '__LocalVue__(')
		return {
			script: transformImports(code),
			style
		}
	} else if (code.indexOf('__LocalVue__') > -1) {
		return {
			script: code,
			style
		}
	} else if (isCodeVueSfc(code)) {
		const transformed = normalizeSfcComponent(code)
		return separateScript(transformed.component, transformed.style)
	}
	const findStartTemplateMatch = /^\W*</.test(code) ? { index: 0 } : code.match(/\n[\t ]*</)
	const limitScript = findStartTemplateMatch ? findStartTemplateMatch.index : -1
	return {
		script: transformImports(code.slice(0, limitScript)),
		html: limitScript > -1 ? code.slice(limitScript) : undefined
	}
}
