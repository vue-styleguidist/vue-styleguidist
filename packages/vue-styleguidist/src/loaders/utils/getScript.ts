import { parseComponent } from 'vue-template-compiler'
import { isCodeVueSfc } from 'vue-inbrowser-compiler-utils'

export default (code: string, jsxInExamples: boolean): string => {
	// if in JSX mode or litteral return examples code as is
	if (
		jsxInExamples ||
		/new Vue\(/.test(code) ||
		/\n\W+?export\W+default\W/.test(code) ||
		/\n\W+?module.exports(\W+)?=/.test(code)
	) {
		return code
	}

	// script is at the beginning of a line after a return
	// In case we are loading a vue component as an example, extract script tag
	if (isCodeVueSfc(code)) {
		const parts = parseComponent(code)
		return parts && parts.script ? parts.script.content : ''
	}

	//else it could be the weird almost jsx of vue-styleguidist
	return code.split(/\n[\t ]*</)[0]
}
