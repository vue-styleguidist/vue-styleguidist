import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import Styled from 'rsg-components/Styled'
import Arguments from 'rsg-components/Arguments'
import JsDoc from 'rsg-components/JsDoc'
import Markdown from 'rsg-components/Markdown'
import Name from 'rsg-components/Name'
import Table from 'rsg-components/Table'
import getOriginColumn from 'rsg-components/OriginColumn'
import propStyles from '../../utils/propStyles'

function renderDescription(myClasses) {
	return function renderDesc(prop) {
		const { description, tags = {} } = prop

		return (
			<div>
				<div className={myClasses.descriptionWrapper}>
					{description && <Markdown text={description} />}
				</div>
				<JsDoc {...tags} />
			</div>
		)
	}
}

function renderProperties(prop) {
	let { properties } = prop
	if (Array.isArray(properties)) {
		properties = properties.reduce((total, current) => {
			total.push({
				name: current.name,
				type: {
					name:
						total.length || current.type.names[0] !== 'undefined'
							? current.type.names.join(' | ')
							: prop.type.names.join(' | ')
				},
				description: current.description,

				// make each arguments display on its own line
				block: true
			})
			return total
		}, [])
	} else if (prop.type) {
		properties = [
			{
				name: '<anonymous>',
				type: {
					name: prop.type.names.join(' | ')
				}
			}
		]
	}

	return properties && properties.length > 0 ? <Arguments args={properties} /> : null
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

export const columns = (events, classes) => [
	{
		caption: 'Event name',
		render: renderName,
		className: classes.name
	},
	{
		caption: 'Description',
		render: renderDescription(classes),
		className: classes.description
	},
	...(events.some(p => p.properties || p.type)
		? [
				{
					caption: 'Properties',
					render: renderProperties
				}
		  ]
		: []),
	...getOriginColumn(events)
]

function EventsRenderer({ props, classes }) {
	const evts = propsToArray(props)
	return <Table columns={columns(evts, classes)} rows={evts} getRowKey={getRowKey} />
}

EventsRenderer.propTypes = {
	props: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired
}

export default Styled(propStyles)(EventsRenderer)
