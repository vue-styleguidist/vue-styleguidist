import React from 'react'
import PropTypes from 'prop-types'
import { MethodDescriptor } from 'vue-docgen-api'
import Styled, { JssInjectedProps } from 'rsg-components/Styled'
import Markdown from 'rsg-components/Markdown'
import Argument from 'rsg-components/Argument'
import Arguments from 'rsg-components/Arguments'
import Name from 'rsg-components/Name'
import JsDoc from 'rsg-components/JsDoc'
import Table from 'rsg-components/Table'
import getOriginColumn from 'rsg-components/OriginColumn'
import methodStyles from '../../utils/propStyles'
import renderTypeString from '../../utils/renderTypeString'

const getRowKey = (row: MethodDescriptor) => row.name

function renderMethodName({ name, tags = {} }: MethodDescriptor) {
	return <Name deprecated={!!tags.deprecated}>{`${name}()`}</Name>
}

function renderDescription({ description, returns, tags = {} }: MethodDescriptor) {
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
						description={returns.description as string}
					/>
				</div>
			)}
			<JsDoc {...tags} />
		</>
	)
}

function renderParameters({ params = [] }: MethodDescriptor) {
	return (
		<Arguments
			args={params.map(p => ({
				block: true,
				...p,
				type: p.type ? { name: renderTypeString(p.type) } : undefined,
				name: p.name || '',
				description: p.description as string
			}))}
		/>
	)
}

export const columns = (methods: MethodDescriptor[], classes: Record<string, string>) => [
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

interface MethodsRendererProps extends JssInjectedProps {
	methods: MethodDescriptor[]
}

export const MethodsRenderer: React.FC<MethodsRendererProps> = ({ methods, classes }) => {
	return <Table columns={columns(methods, classes)} rows={methods} getRowKey={getRowKey} />
}

MethodsRenderer.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	methods: PropTypes.array.isRequired
}

export default Styled<MethodsRendererProps>(methodStyles as any)(MethodsRenderer)
