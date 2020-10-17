import React from 'react'

function renderOrigin(prop) {
	const { extends: ext, mixin } = prop
	return ext ? (
		<span title={`extends: ${ext.path}`}>E: {ext.name}</span>
	) : (
		mixin && <span title={`mixin: ${mixin.path}`}>M: {mixin.name}</span>
	)
}

export default function getOriginColumn(props) {
	return props && props.some(p => p.mixin || p.extends)
		? [
				{
					caption: 'Origin',
					render: renderOrigin
				}
		  ]
		: []
}
