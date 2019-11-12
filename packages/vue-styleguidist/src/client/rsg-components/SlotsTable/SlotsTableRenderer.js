import React from 'react'
import PropTypes from 'prop-types'
import Styled from 'rsg-components/Styled'
import Markdown from 'rsg-components/Markdown'
import Name from 'rsg-components/Name'
import Table from 'rsg-components/Table'
import map from 'lodash/map'
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

export const columns = classes => [
	{
		caption: 'Slot',
		render: renderName,
		className: classes.name
	},
	{
		caption: 'Description',
		render: renderDescription,
		className: classes.description
	}
]

function SlotsTableRenderer({ props: slots, classes }) {
	return <Table columns={columns(classes)} rows={propsToArray(slots)} getRowKey={getRowKey} />
}

SlotsTableRenderer.propTypes = {
	props: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired
}

export default Styled(propStyles)(SlotsTableRenderer)
