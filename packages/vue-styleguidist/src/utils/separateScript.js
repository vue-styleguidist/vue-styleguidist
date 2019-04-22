import normalizeComponent from './normalizeComponent'
import { isCodeVueSfc } from '../../loaders/utils/isCodeVueSfc'

/**
 * Reads the code in string and separates the javascript part and the html part
 * then sets the nameVarComponent variable with the value of the component parameters
 * @param {string} code
 * @return {script:String, html:String}
 *
 */
export default function separateScript(code, style) {
	let index
	const lines = code.split('\n')
	if (code.indexOf('new Vue') > -1) {
		const indexVueBegin = code.indexOf('new Vue')

		const script = [`${code.slice(0, indexVueBegin)};`, `${code.slice(indexVueBegin)};`].join('\n')
		return {
			script,
			style
		}
	} else if (isCodeVueSfc(code)) {
		const transformed = normalizeComponent(code)
		return separateScript(transformed.component, transformed.style)
	}
	for (let id = 0; id < lines.length; id++) {
		if (lines[id].trim().charAt(0) === '<') {
			index = id
			break
		}
	}
	return {
		script: lines
			.slice(0, index)
			.join('\n')
			.trim(),
		html: lines.slice(index).join('\n')
	}
}
