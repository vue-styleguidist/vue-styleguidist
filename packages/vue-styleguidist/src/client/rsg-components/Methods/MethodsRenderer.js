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
import methodStyles from '../../utils/propStyles'
import renderTypeString from '../../utils/renderTypeString'

const getRowKey = row => row.name

function renderMethodName({ name, tags = {} }) {
	return <Name deprecated={!!tags.deprecated}>{`${name}()`}</Name>
}

function renderDescription({ description, returns, tags = {} }) {
	return (
		<>
			{description && <Markdown text={description} />}
			{returns && (
				<div>
					Returns:{' '}
					<Argument
						name=""
						{...returns}
						type={returns.type ? { name: renderTypeString(returns.type) } : undefined}
						description={returns.description}
					/>
				</div>
			)}
			<JsDoc {...tags} />
		</>
	)
}

function renderParameters({ params = [] }) {
	return (
		<Arguments
			args={params.map(p => ({
				block: true,
				...p,
				type: p.type ? { name: renderTypeString(p.type) } : undefined,
				name: p.name || '',
				description: p.description
			}))}
		/>
	)
}

export const columns = (methods, classes) => [
	{
		caption: 'Method name',
		render: renderMethodName,
		className: classes.name
	},
	{
		caption: 'Description',
		render: renderDescription(classes),
		className: classes.description
	},
	{
		caption: 'Parameters',
		render: renderParameters
	},
	...getOriginColumn(methods)
]

export const MethodsRenderer = ({ methods, classes }) => {
	return <Table columns={columns(methods, classes)} rows={methods} getRowKey={getRowKey} />
}

MethodsRenderer.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	methods: PropTypes.array.isRequired
}

export default Styled(methodStyles)(MethodsRenderer)
