import { parseComponent } from 'vue-template-compiler'

export default function isCodeVueSfc(code: string) {
	const parts = parseComponent(code)
	return !!parts.script || !!parts.template
}
