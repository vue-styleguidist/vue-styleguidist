import { isCodeVueSfc } from 'vue-inbrowser-compiler-utils'
import normalizeSfcComponent, { parseScriptCode } from './normalizeSfcComponent'
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
export default function compile(
	code: string,
	jsx?: boolean,
	transform: (code: string) => string = c => c
): EvaluableComponent {
	// if the component is written as a Vue sfc,
	// transform it in to a "return"
	// even if jsx is used in an sfc we still use this use case
	if (isCodeVueSfc(code)) {
		return normalizeSfcComponent(code, transform)
	}

	// if it's not an SFC, it must be a simple template or a vsg format
	// lets separate the template from the script
	// if jsx examples without the SFC shell
	// export default {render: (h) => <Button>}
	if (jsx) {
		const { preprocessing, component, postprocessing } = parseScriptCode(transform(code) || '')
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
		script: transformScript(code, transform),
		template,
		vsgMode: true
	}
}
