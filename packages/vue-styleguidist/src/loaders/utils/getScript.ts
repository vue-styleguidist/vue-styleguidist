import { isCodeVueSfc, parseComponent } from 'vue-inbrowser-compiler-utils'

export default function (code: string, jsxInExamples: boolean): string {
	// In case we are loading a vue component as an example, extract script tag
	if (isCodeVueSfc(code)) {
		const descriptor = parseComponent(code)
		return descriptor?.script?.content ?? ''
	}

	// if in JSX mode or literal return examples code as is
	if (jsxInExamples || /new Vue\(/.test(code)) {
		return code
	}

	if (/\n\W+?export\W+default\W/.test(code) || /\n\W+?module.exports(\W+)?=/.test(code)) {
		return code
	}

	//else it could be the weird almost jsx of vue-styleguidist
	return /^</.test(code.trim()) ? '' : code.split(/\n[\t ]*</)[0]
}
