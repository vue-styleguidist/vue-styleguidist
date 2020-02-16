/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import Styled from 'rsg-components/Styled'
import Markdown from 'rsg-components/Markdown'
import Argument from 'rsg-components/Argument'
import Arguments from 'rsg-components/Arguments'
import Name from 'rsg-components/Name'
import JsDoc from 'rsg-components/JsDoc'
import Table from 'rsg-components/Table'
import getOriginColumn from 'rsg-components/OriginColumn'
import propStyles from '../../utils/propStyles'

const getRowKey = row => row.name

function renderMethodName({ name, tags = {} }) {
	return <Name deprecated={!!tags.deprecated}>{`${name}()`}</Name>
}

function renderDescription({ description, returns, tags = {} }) {
	return (
		<div>
			{description && <Markdown text={description} />}
			{returns && <Argument name=" " block returns {...returns} />}
			<JsDoc {...tags} />
		</div>
	)
}

function renderParameters({ params = [] }) {
	return <Arguments args={params.map(p => ({ block: true, ...p }))} />
}

export const columns = (methods, classes) => [
	{
		caption: 'Method name',
		render: renderMethodName,
		className: classes.name
	},
	{
		caption: 'Description',
		render: renderDescription,
		className: classes.description
	},
	{
		caption: 'Parameters',
		render: renderParameters
	},
	...getOriginColumn(methods)
]

function MethodsRenderer({ methods, classes }) {
	return <Table columns={columns(methods, classes)} rows={methods} getRowKey={getRowKey} />
}

MethodsRenderer.propTypes = {
	methods: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			description: PropTypes.string,
			returns: PropTypes.object,
			params: PropTypes.array,
			tags: PropTypes.object
		})
	).isRequired,
	classes: PropTypes.object.isRequired
}

export default Styled(propStyles)(MethodsRenderer)
