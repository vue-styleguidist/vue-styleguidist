/* eslint-disable react/prop-types */
import React from 'react'
// eslint-disable-next-line import/no-unresolved,import/extensions
import Editor from 'rsg-components/EditorString'

export default function EditorPrecompiled(props) {
	return (
		<Editor {...props} code={props.code.raw} onChange={code => props.onChange({ raw: code })} />
	)
}
