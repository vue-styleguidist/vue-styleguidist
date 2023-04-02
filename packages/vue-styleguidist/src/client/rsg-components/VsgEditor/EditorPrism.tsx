import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import * as Rsg from 'react-styleguidist'
import { isCodeVueSfc, parseComponent } from 'vue-inbrowser-compiler-utils'
import { polyfill } from 'react-lifecycles-compat'
import SimpleEditor from 'react-simple-code-editor'
import { highlight as prismHighlight, languages } from 'prismjs'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-tsx'
import { space } from 'react-styleguidist/lib/client/styles/theme'
import prismTheme from 'react-styleguidist/lib/client/styles/prismTheme'
import Styled, { JssInjectedProps } from 'rsg-components/Styled'
import { useStyleGuideContext } from 'rsg-components/Context/Context'
import getScript from '../../../loaders/utils/getScript'
import { SanitizedStyleguidistConfig } from '../../../types/StyleGuide'

const VSimpleEditor = SimpleEditor as any

function getSpacer(s :any){
  return s.setup ? 'setup' : ' '
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
  if(script.loc) {
    const orderedScripts = scriptSetup ? [scriptSetup, script].sort((s1, s2) => s1.loc.start > s2.loc.start ? 1 : -1) : [script]
    const firstScript = orderedScripts[0]
    const nextScript = orderedScripts[1]
    if(nextScript) {
      return code.slice(0, firstScript.loc.start) + getSpacer(firstScript) + code.slice(firstScript.loc.end, nextScript.loc.start) + getSpacer(nextScript) + code.slice(nextScript.loc.end)
    } else {
      return code.slice(0, firstScript.loc.start) + getSpacer(firstScript) + code.slice(firstScript.loc.end)
    }
  }

  // in vue 2 the start & stop are directly attached to the script member.
  return code.slice(0, script.start) + ' ' + code.slice(script.end)
}

const highlight = (lang: 'vsg' | 'vue-sfc', jsxInExamples: boolean): ((code: string) => string) => {
	if (lang === 'vsg') {
		return code => {
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
			return scriptCodeHighlighted + prismHighlight(templateCode, languages.html, lang)
		}
	} else {
		const langScheme = languages.html

		return code => {
			const comp = parseComponent(code)

			const newCode = comp.script ? getCodeWithoutScript(code, comp.script, comp.scriptSetup) : code
      
			const htmlHighlighted = prismHighlight(newCode, langScheme, 'html')

			const highlightedScript = comp.script ? htmlHighlighted.replace(
				new RegExp(`<span class="token language-javascript">${getSpacer(comp.script)}<\\/span>`, 'g'),
				`<span class="token language-typescript">${prismHighlight(
					comp.script.content,
					languages[comp.script.lang || 'ts'],
					comp.script.lang || 'ts'
				)}</span>`) : htmlHighlighted

      const highlightedScriptSetup = comp.scriptSetup ? highlightedScript.replace(
        new RegExp(`<span class="token language-javascript">${getSpacer(comp.scriptSetup)}<\\/span>`, 'g'),
        `<span class="token language-typescript">${prismHighlight(
          comp.scriptSetup.content,
          languages.ts,
          'ts'
        )}</span>`) : highlightedScript

        return highlightedScriptSetup
		}
	}
}

const styles = ({ fontFamily, fontSize, color, borderRadius }: Rsg.Theme) => ({
	root: {
		fontFamily: fontFamily.monospace,
		fontSize: fontSize.small,
		borderRadius,
		'& textarea': {
			isolate: false,
			transition: 'all ease-in-out .1s',
			// important to override inline styles in react-simple-code-editor
			border: `1px ${color.border} solid !important`,
			borderRadius
		},
		'& textarea:focus': {
			isolate: false,
			outline: 0,
			borderColor: `${color.link} !important`,
			boxShadow: [[0, 0, 0, 2, color.focus]]
		}
	},
	jssEditor: {
		background: color.codeBackground,
		...prismTheme({ color })
	}
})

export interface UnconfiguredEditorProps extends JssInjectedProps {
	code: string
	jssThemedEditor: boolean
	jsxInExamples: boolean
	onChange: (val: string) => void
	editorPadding?: number
}

export class UnconfiguredEditor extends Component<UnconfiguredEditorProps> {
	public static propTypes = {
		classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
		code: PropTypes.string.isRequired,
		jssThemedEditor: PropTypes.bool.isRequired,
		jsxInExamples: PropTypes.bool.isRequired,
		onChange: PropTypes.func.isRequired,
		editorPadding: PropTypes.number
	}

	public state = { code: this.props.code, prevCode: this.props.code }

	public static getDerivedStateFromProps(
		nextProps: UnconfiguredEditorProps,
		prevState: { code: string; prevCode: string }
	) {
		const { code } = nextProps
		if (prevState.prevCode !== code) {
			return {
				prevCode: code,
				code
			}
		}
		return null
	}

	public shouldComponentUpdate(
		nextProps: UnconfiguredEditorProps,
		nextState: { code: string; prevCode: string }
	) {
		return nextState.code !== this.state.code
	}

	public handleChange = (code: string) => {
		this.setState({ code })
		this.props.onChange(code)
	}

	public render() {
		const { root, jssEditor } = this.props.classes
		const isVueSFC = isCodeVueSfc(this.state.code)
		const { jssThemedEditor, jsxInExamples, editorPadding } = this.props
		const langClass = isVueSFC ? 'language-html' : 'language-jsx'
		return (
			<VSimpleEditor
				className={cx(root, jssThemedEditor ? jssEditor : langClass, 'prism-editor')}
				value={this.state.code}
				onValueChange={this.handleChange}
				highlight={highlight(isVueSFC ? 'vue-sfc' : 'vsg', jsxInExamples)}
				// Padding should be passed via a prop (not CSS) for a proper
				// cursor position calculation
				padding={editorPadding || space[2]}
				// to make sure the css styles for prism are taken into account
				preClassName={cx(!jssThemedEditor && langClass)}
			/>
		)
	}
}

const PEditor = polyfill(UnconfiguredEditor)

type EditorProps = Omit<UnconfiguredEditorProps, 'jssThemedEditor' | 'jsxInExamples'>

function Editor(props: EditorProps) {
	const {
		config: { jssThemedEditor, jsxInExamples }
	} = useStyleGuideContext() as any as { config: SanitizedStyleguidistConfig }
	return <PEditor {...props} jssThemedEditor={jssThemedEditor} jsxInExamples={jsxInExamples} />
}

export default Styled<EditorProps>(styles as any)(Editor)

