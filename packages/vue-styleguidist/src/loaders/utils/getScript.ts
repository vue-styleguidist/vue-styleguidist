import { parse } from '@vue/compiler-sfc'
import { isCodeVueSfc } from 'vue-inbrowser-compiler-utils'

export default function (code: string, jsxInExamples: boolean): string {
	// In case we are loading a vue component as an example, extract script tag
	if (isCodeVueSfc(code)) {
		const {descriptor} = parse(code)
		return descriptor && descriptor.script ? descriptor.script.content : ''
	}

	// if in JSX mode return the code as is
	if (jsxInExamples) {
		return code
	}

	if (/\n\W+?export\W+default\W/.test(code) || /\n\W+?module.exports(\W+)?=/.test(code)) {
		return code
	}

	//else it could be the weird almost jsx of vue-styleguidist
	return /^</.test(code.trim()) ? '' : code.split(/\n[\t ]*</)[0]
}
