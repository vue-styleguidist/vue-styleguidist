/* eslint-disable react/prop-types */
import React, { Suspense, lazy } from 'react'

const Editor = lazy(() => import(/* webpackChunkName: "editor" */ 'rsg-components/EditorStatic'))

export default function EditorAsync(props) {
	return (
		<Suspense fallback={<div>Loading Editor...</div>}>
			<Editor {...props} />
		</Suspense>
	)
}
