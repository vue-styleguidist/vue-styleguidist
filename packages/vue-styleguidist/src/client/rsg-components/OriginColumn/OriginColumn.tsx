import React from 'react'

interface OriginInfo {
	name: string
	path: string
}

function renderOrigin(prop: { extends?: OriginInfo; mixin?: OriginInfo }) {
	const { extends: ext, mixin } = prop
	return ext ? (
		<div title={ext.path}>extends: {ext.name}</div>
	) : (
		mixin && <div title={mixin.path}>mixin: {mixin.name}</div>
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
