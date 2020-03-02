import { parseComponent } from 'vue-template-compiler'
import { isCodeVueSfc } from 'vue-inbrowser-compiler-utils'

export default (code: string, jsxInExamples: boolean): string => {
	// In case we are loading a vue component as an example, extract script tag
	if (isCodeVueSfc(code)) {
		const parts = parseComponent(code)
		return parts && parts.script ? parts.script.content : ''
	}

	// if in JSX mode or litteral return examples code as is
	if (jsxInExamples || /new Vue\(/.test(code)) {
		return code
	}

	if (/\n\W+?export\W+default\W/.test(code) || /\n\W+?module.exports(\W+)?=/.test(code)) {
		return code
	}

	//else it could be the weird almost jsx of vue-styleguidist
	return /^</.test(code.trim()) ? '' : code.split(/\n[\t ]*</)[0]
}
