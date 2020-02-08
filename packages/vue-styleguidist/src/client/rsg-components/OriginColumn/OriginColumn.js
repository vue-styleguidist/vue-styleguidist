import React from 'react'

function renderOrigin(prop) {
	const { extends: ext, mixin } = prop
	return (
		<>
			{ext && <div>extends: {ext.name}</div>}
			{mixin && <div>mixin: {mixin.name}</div>}
		</>
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
