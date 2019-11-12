import React from 'react'
import PropTypes from 'prop-types'
import Group from 'react-group'
import Styled from 'rsg-components/Styled'
import Arguments from 'rsg-components/Arguments'
import Code from 'rsg-components/Code'
import JsDoc from 'rsg-components/JsDoc'
import Markdown from 'rsg-components/Markdown'
import Name from 'rsg-components/Name'
import Type from 'rsg-components/Type'
import Para from 'rsg-components/Para'
import Table from 'rsg-components/Table'
import map from 'lodash/map'
import { unquote, showSpaces } from '../../utils/utils'
import propStyles from '../../utils/propStyles'

function renderType(type) {
	if (!type) {
		return 'unknown'
	}
	let name = type.name
	const names = type.names

	if (names) {
		name = names.join('|')
	}
	switch (name) {
		case 'arrayOf':
			return `${type.value.name}[]`
		case 'objectOf':
			return `{${renderType(type.value)}}`
		case 'instanceOf':
			return type.value
		default:
			return name
	}
}

function renderEnum(prop) {
	if (!Array.isArray(prop.type.value)) {
		return <span>{prop.type.value}</span>
	}

	const values = prop.type.value.map(({ value }) => (
		<Code key={value}>{showSpaces(unquote(value))}</Code>
	))
	return (
		<span>
			One of:{' '}
			<Group separator=", " inline>
				{values}
			</Group>
		</span>
	)
}

function renderShape(props) {
	const rows = []
	for (const name in props) {
		const prop = props[name]
		const description = prop.description
		rows.push(
			<div key={name}>
				<Name>{name}</Name>
				{': '}
				<Type>{renderType(prop)}</Type>
				{description && ' — '}
				{description && <Markdown text={description} inline />}
			</div>
		)
	}
	return rows
}

function renderDescription(myClasses) {
	return function renderDesc(prop) {
		const { description, tags = {} } = prop

		const extra = renderExtra(prop)

		return (
			<div>
				<div className={myClasses.descriptionWrapper}>
					{description && <Markdown text={description} />}
				</div>
				{extra && <Para>{extra}</Para>}
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
					name: renderType(
						total.length || current.type.names[0] !== 'undefined' ? current.type : prop.type
					)
				},
				description: current.description,

				// make each arguments display on its own line
				block: true
			})
			return total
		}, [])
	}

	return <>{properties && properties.length > 0 && <Arguments args={properties} />}</>
}

function renderExtra(prop) {
	const type = prop.type

	if (!type) {
		return null
	}
	switch (type.name) {
		case 'enum':
			return renderEnum(prop)
		case 'union':
			return renderUnion(prop)
		case 'shape':
			return renderShape(prop.type.value)
		case 'arrayOf':
			if (type.value.name === 'shape') {
				return renderShape(prop.type.value.value)
			}
			return null
		case 'objectOf':
			if (type.value.name === 'shape') {
				return renderShape(prop.type.value.value)
			}
			return null
		default:
			return null
	}
}

function renderUnion(prop) {
	if (!Array.isArray(prop.type.value)) {
		return <span>{prop.type.value}</span>
	}

	const values = prop.type.value.map((value, index) => (
		<Type key={`${value.name}-${index}`}>{renderType(value)}</Type>
	))
	return (
		<span>
			One of type:{' '}
			<Group separator=", " inline>
				{values}
			</Group>
		</span>
	)
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

export const columns = (props, classes) => [
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
	{
		caption: 'Properties',
		render: renderProperties
	}
]

function EventsRenderer({ props, classes }) {
	return (
		<Table columns={columns(props, classes)} rows={propsToArray(props)} getRowKey={getRowKey} />
	)
}

EventsRenderer.propTypes = {
	props: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired
}

export default Styled(propStyles)(EventsRenderer)
