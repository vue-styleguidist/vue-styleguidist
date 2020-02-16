import React from 'react'

interface OriginInfo {
	name: string
	path: string
}

function renderOrigin(prop: { extends?: OriginInfo; mixin?: OriginInfo }) {
	const { extends: ext, mixin } = prop
	return ext ? (
		<span title={`extends: ${ext.path}`}>E: {ext.name}</span>
	) : (
		mixin && <span title={`mixin: ${mixin.path}`}>M: {mixin.name}</span>
	)
}

export default function getOriginColumn(props: { extends?: OriginInfo; mixin?: OriginInfo }[]) {
	return props && props.some(p => p.mixin || p.extends)
		? [
				{
					caption: 'Origin',
					render: renderOrigin
				}
		  ]
		: []
}
