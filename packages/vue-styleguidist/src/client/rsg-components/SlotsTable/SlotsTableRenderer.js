/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import Styled from 'rsg-components/Styled'
import Markdown from 'rsg-components/Markdown'
import Name from 'rsg-components/Name'
import Table from 'rsg-components/Table'
import Arguments from 'rsg-components/Arguments'
import getOriginColumn from 'rsg-components/OriginColumn'
import propStyles from '../../utils/propStyles'

function renderDescription(prop) {
	const { description } = prop
	return <div>{description ? <Markdown text={description} /> : '-'}</div>
}

function renderName(prop) {
	const { name, tags = {} } = prop
	return <Name deprecated={!!tags.deprecated}>{name}</Name>
}

export function getRowKey(row) {
	return row.name
}

export function propsToArray(props) {
	return map(props, (prop, name) => ({ ...prop, name }))
}

export function renderBindings({ bindings }) {
	return bindings && bindings.length ? (
		<Arguments args={bindings.map(b => ({ block: true, ...b }))} />
	) : (
		'-'
	)
}

export const columns = (slots, classes) => [
	{
		caption: 'Slot',
		render: renderName,
		className: classes.name
	},
	{
		caption: 'Description',
		render: renderDescription,
		className: classes.description
	},
	// only add the bindings column if there is any bindings
	...(slots.some(s => s.bindings)
		? [
				{
					caption: 'Bindings',
					render: renderBindings
				}
		  ]
		: []),
	...getOriginColumn(slots)
]

function SlotsTableRenderer({ props: slots, classes }) {
	const slotsArray = propsToArray(slots)
	return <Table columns={columns(slotsArray, classes)} rows={slotsArray} getRowKey={getRowKey} />
}

SlotsTableRenderer.propTypes = {
	props: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired
}

export default Styled(propStyles)(SlotsTableRenderer)
