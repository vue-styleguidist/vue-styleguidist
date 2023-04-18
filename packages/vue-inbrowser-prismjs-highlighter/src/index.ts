/* eslint-disable import/extensions */
// NOTE: this weird way of importing prism is necessary because
// prism is not a ESM ready library
import { parseComponent } from 'vue-inbrowser-compiler-utils'
import pkg from 'prismjs'
import 'prismjs/components/prism-clike.js'
import 'prismjs/components/prism-markup.js'
import 'prismjs/components/prism-javascript.js'
import 'prismjs/components/prism-typescript.js'
import 'prismjs/components/prism-jsx.js'
import 'prismjs/components/prism-tsx.js'
import 'prismjs/components/prism-css.js'

import getScript from './getScript'

const { highlight: prismHighlight, languages } = pkg

export const CONFIGURED_LANGS = ['html', 'vsg', 'jsx', 'tsx'] as const
export type CONFIGURED_LANGS_TYPE = (typeof CONFIGURED_LANGS)[number]

export default async function () {
	return function (lang: CONFIGURED_LANGS_TYPE, jsxInExamples: boolean = false) {
		if (lang === 'vsg') {
			// render vsg format
			return (code: string, errorLoc?: any) => {
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
					return getSquiggles(errorLoc) + scriptCodeHighlighted
				}
				const templateCode = code.slice(scriptCode.length)
				const templateHighlighted = prismHighlight(templateCode, languages['html'], lang)

				return (
					getSquiggles(
						errorLoc,
						errorLoc && errorLoc.start ? scriptCode.split('\n').length - 1 : 0
					) + renderLines(scriptCodeHighlighted + templateHighlighted)
				)
			}
		} else if (lang === 'html') {
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
							new RegExp(
								`<span class="token language-javascript">${getSpacer(comp.script)}<\\/span>`,
								'g'
							),
							`<span class="token language-typescript">${prismHighlight(
								comp.script.content,
								languages[comp.script.lang || 'ts'],
								comp.script.lang || 'ts'
							)}</span>`
					  )
					: htmlHighlighted

				const highlightedScriptSetup = comp.scriptSetup
					? highlightedScript.replace(
							new RegExp(
								`<span class="token language-javascript">${getSpacer(comp.scriptSetup)}<\\/span>`,
								'g'
							),
							`<span class="token language-typescript">${prismHighlight(
								comp.scriptSetup.content,
								languages.ts,
								'ts'
							)}</span>`
					  )
					: highlightedScript

				return renderLines(highlightedScriptSetup)
			}
		} else {
			// all other formats
			const langScheme = languages[lang]
			return (code: string) => {
				return renderLines(prismHighlight(code, langScheme, lang))
			}
		}
	}
}

function renderLines(code: string) {
	return `<span class='line'>${code.replace(/\n/g, "</span>\n<span class='line'>")}</span>`
}

function getSquiggles(errorLoc?: any, lineOffset = 0) {
	if (!errorLoc) return ''
	const columnOffSet = errorLoc.start ? 0 : 1
	const errorWidth = errorLoc.end ? errorLoc.end.column - errorLoc.start.column + 1 : 2
	let { line, column } = errorLoc.start ? errorLoc.start : errorLoc
	return (
		'<span class="VueLive-squiggles-wrapper">' +
		Array(line + lineOffset).join('\n') +
		Array(column + columnOffSet).join(' ') +
		'<span class="VueLive-squiggles">' +
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
