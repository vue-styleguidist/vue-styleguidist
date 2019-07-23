import React, { Suspense, lazy } from 'react'

const Editor = lazy(() => import(/* webpackChunkName: "editor" */ './Editor.js'))

export default function EditorAsync(props) {
	return (
		<Suspense fallback={<div>Loading Editor...</div>}>
			<Editor {...props} />
		</Suspense>
	)
}
