/* eslint-disable react/prop-types */
import React, { Suspense, lazy, useState, useEffect } from 'react'

// eslint-disable-next-line import/no-unresolved
const Editor = lazy(() => import(/* webpackChunkName: "editor" */ '@monaco-editor/react'))

export default function EditorAsync(props) {
	const editorOptions = {
		minimap: {
			enabled: false
		},
		scrollBeyondLastLine: false
	}

	const [code, setCode] = useState(props.code.raw)

	useEffect(() => {
		props.onChange({ raw: code })
	}, [code])

	const height = code.split(/\r\n|\r|\n/).length * 19

	let codeLang = 'html'
	if (code.includes('template:')) {
		if (code.includes('lang="ts"')) {
			codeLang = 'typescript'
		} else {
			codeLang = 'javascript'
		}
	}

	return (
		<Suspense fallback={<div>Loading Editor...</div>}>
			<div>
				<Editor
					value={code}
					defaultLanguage={codeLang}
					height={height}
					theme="vs-dark"
					options={editorOptions}
					onChange={val => setCode(val)}
				/>
			</div>
		</Suspense>
	)
}
