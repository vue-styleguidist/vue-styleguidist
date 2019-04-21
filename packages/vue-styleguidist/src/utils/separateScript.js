import transformSingleFileComponent from './singleFileComponentUtils'
import { isCodeVueSfc } from '../../loaders/utils/isCodeVueSfc'

export const nameVarComponent = '__component__'

/**
 * Reads the code in string and separates the javascript part and the html part
 * then sets the nameVarComponent variable with the value of the component parameters
 * @param {string} code
 * @return {js:String, html:String}
 *
 */
export default function separateScript(code, style) {
	let index
	const lines = code.split('\n')
	if (code.indexOf('new Vue') > -1) {
		const indexVueBegin = code.indexOf('new Vue')
		const setVue = [
			'',
			'// Ignore: Extract the configuration of the example component',
			`function Vue(params){ ${nameVarComponent} = params }`
		].join('\n')

		return {
			js: code.slice(0, indexVueBegin),
			vueComponent: code.slice(indexVueBegin) + setVue,
			style
		}
	} else if (isCodeVueSfc(code)) {
		const transformed = transformSingleFileComponent(code)
		return separateScript(transformed.component, transformed.style)
	}
	for (let id = 0; id < lines.length; id++) {
		if (lines[id].trim().charAt(0) === '<') {
			index = id
			break
		}
	}
	return {
		js: lines.slice(0, index).join('\n'),
		html: lines.slice(index).join('\n')
	}
}
