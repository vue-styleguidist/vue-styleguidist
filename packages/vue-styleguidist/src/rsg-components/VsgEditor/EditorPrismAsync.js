/* eslint-disable react/prop-types */
import React from 'react'
import Editor from './EditorPrism'

export default function EditorAsync(props) {
	return (
		<Editor {...props} code={props.code.raw} onChange={code => props.onChange({ raw: code })} />
	)
}
