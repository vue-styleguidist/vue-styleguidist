/* eslint-disable import/extensions */
// NOTE: this weird way of importing prism is necessary because
// prism is not a ESM ready library
import { parseComponent } from 'vue-inbrowser-compiler-utils'
import Prism from 'prismjs'
import 'prismjs/components/prism-clike.js'
import 'prismjs/components/prism-markup.js'
import 'prismjs/components/prism-javascript.js'
import 'prismjs/components/prism-typescript.js'
import 'prismjs/components/prism-jsx.js'
import 'prismjs/components/prism-tsx.js'
import 'prismjs/components/prism-css.js'

import getScript from './getScript'

Prism.manual = true

const { highlight: prismHighlight, languages } = Prism

export const CONFIGURED_LANGS = ['html', 'vue-sfc', 'vsg', 'jsx', 'tsx'] as const
export type CONFIGURED_LANGS_TYPE = (typeof CONFIGURED_LANGS)[number]

/**
 * Returns a function that returns a function will highlight the code.
 * @param errorSquigglesClassPrefix class prefix for error squiggles
 * @returns function that will return the code highlighter for the given language
 */
export default async function (errorSquigglesClassPrefix?: string) {
	/**
	 * Return a function that will highlight the code.
	 * @param lang language of the code
	 * @param jsxInExamples whether to use jsx or tsx for highlighting
	 */
	function getHighlighter(lang: CONFIGURED_LANGS_TYPE, jsxInExamples: boolean = false) {
		if (lang === 'vsg') {
			// render vsg format
			return (code: string) => {
				if (!code) {
					return ''
				}
				const scriptCode = getScript(code, jsxInExamples)
				const scriptCodeHighlighted = prismHighlight(
					scriptCode,
					languages[jsxInExamples ? 'tsx' : 'ts'],
					lang
				)
				if (code.length === scriptCode.length) {
					return scriptCodeHighlighted
				}
				const templateCode = code.slice(scriptCode.length)
				const templateHighlighted = prismHighlight(templateCode, languages['html'], lang)

				return (
					renderLines(scriptCodeHighlighted + templateHighlighted)
				)
			}
		} else if (['html', 'vue-sfc'].includes(lang)) {
			// render vue SFC component format
			const langScheme = languages.html

			return (code: string) => {
				const comp = parseComponent(code)

				const newCode = comp.script
					? getCodeWithoutScript(code, comp.script, comp.scriptSetup)
					: code

				const htmlHighlighted = prismHighlight(newCode, langScheme, 'html')

				const highlightedScript = comp.script
					? htmlHighlighted.replace(
            getReplacedTokenRE(comp.script),
							prismHighlight(
								comp.script.content,
								languages[comp.script.lang || 'ts'],
								comp.script.lang || 'ts'
							)
					  )
					: htmlHighlighted

				const highlightedScriptSetup = comp.scriptSetup
					? highlightedScript.replace(
							
								getReplacedTokenRE(comp.scriptSetup)
							,
							prismHighlight(comp.scriptSetup.content, languages.ts, 'ts')
					  )
					: highlightedScript

				return renderLines(highlightedScriptSetup)
			}
		} else {
			// all other formats
			const langScheme = languages[lang]
			return (code: string, errorLoc?: VueAllPrismError) => {
				return renderLines(prismHighlight(code, langScheme, lang))
			}
		}
	}

  function addSquigglesManagement(highlight: (code:string) => string) {
    return (code:string, errorLoc?: VueAllPrismError) => getSquiggles(errorLoc, errorSquigglesClassPrefix) + highlight(code)
  }

  return (...args:Parameters<typeof getHighlighter>) => addSquigglesManagement(getHighlighter(...args))
}


function renderLines(code: string) {
	return `<span class="line">${code.replace(/\n/g, "</span>\n<span class='line'>")}</span>`
}

export interface VuePrismLocation {
	line: number
	column: number
}

export interface VuePrismError {
	start: VuePrismLocation
	end: VuePrismLocation
}

export type VueAllPrismError = VuePrismError | VuePrismLocation

function getSquiggles(
	errorLoc?: VueAllPrismError,
	errorSquigglesClassPrefix?: string,
) {
	if (!errorLoc) return ''
	const errorWidth = 'end' in errorLoc ? errorLoc.end.column - errorLoc.start.column + 1 : 2
	let { line, column } = 'start' in errorLoc ? errorLoc.start : errorLoc
	return (
		`<span class="${errorSquigglesClassPrefix}-wrapper">` +
		(line > 0 ? Array(line - 1).join('\n') : '') +
		Array(column).join(' ') +
		`<span class="${errorSquigglesClassPrefix}">` +
		Array(errorWidth).join(' ') +
		'</span></span>'
	)
}

/**
 * Return SFC code without any script part.
 * Why? Because we want to highlight the script part in a separate manner.
 * This will allow us to highlight typescript code.
 * @param code SFC code
 * @param script script part of the parsed SFC
 * @param scriptSetup script part of the parsed SFC
 * @returns vue SCF code without any script part.
 * @example
 *    const code = `
 *    <template>
 *    <div>hello</div>
 *    </template>
 *    <script setup lang="ts">
 *    console.log('hello')
 *    </script>
 *    <script lang="ts">
 *    function hello() {
 *    }
 *    </script>`
 *
 *  => Returns
 *
 *     `<template>
 *     <div>hello</div>
 *     </template>
 *     <script setup lang="ts">setup</script>
 *     <script lang="ts"> </script>
 */
function getCodeWithoutScript(code: string, script: any, scriptSetup?: any) {
	// in vue 3 the structure of the script SCF object is different
	// the start & stop are in a `loc` object.
	if (script.loc) {
		const orderedScripts = scriptSetup
			? [scriptSetup, script].sort((s1, s2) => (s1.loc.start.offset > s2.loc.start.offset ? 1 : -1))
			: [script]
		const firstScript = orderedScripts[0]
		const nextScript = orderedScripts[1]
		if (nextScript) {
			return (
				code.slice(0, firstScript.loc.start.offset) +
				getSpacer(firstScript) +
				code.slice(firstScript.loc.end.offset, nextScript.loc.start.offset) +
				getSpacer(nextScript) +
				code.slice(nextScript.loc.end.offset)
			)
		} else {
			return (
				code.slice(0, firstScript.loc.start.offset) +
				getSpacer(firstScript) +
				code.slice(firstScript.loc.end.offset)
			)
		}
	}

	// in vue 2 the start & stop are directly attached to the script member.
	return code.slice(0, script.start) + ' ' + code.slice(script.end)
}

function getSpacer(s: any) {
	return s.setup ? 'setup' : ' '
}

function getReplacedTokenRE(s: any){
  return new RegExp(`<span class="token script"><span class="token language-javascript">${getSpacer(s)}</span></span>`)
}
