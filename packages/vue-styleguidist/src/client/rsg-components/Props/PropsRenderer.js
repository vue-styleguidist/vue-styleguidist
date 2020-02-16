import React from 'react'
import PropTypes from 'prop-types'

import Styled from 'rsg-components/Styled'
import Arguments from 'rsg-components/Arguments'
import Argument from 'rsg-components/Argument'
import Code from 'rsg-components/Code'
import JsDoc from 'rsg-components/JsDoc'
import Markdown from 'rsg-components/Markdown'
import Name from 'rsg-components/Name'
import Table from 'rsg-components/Table'
import getOriginColumn from 'rsg-components/OriginColumn'
import styles from '../../utils/propStyles'
import renderDefaultHoc from './renderDefault'
import renderTypeBox from './renderType'

function renderDescription(classes) {
	return function renderDesc(prop) {
		const { description, tags = {} } = prop
		const args = [...(tags.arg || []), ...(tags.argument || []), ...(tags.param || [])]
		const returnDocumentation = (tags.return && tags.return[0]) || (tags.returns && tags.returns[0])

		return (
			<div>
				<div className={classes.descriptionWrapper}>
					{description && <Markdown text={description} />}
				</div>
				<JsDoc {...tags} />
				{args.length > 0 && <Arguments args={args} heading />}
				{returnDocumentation && <Argument {...returnDocumentation} returns />}
				<div className={classes.type}>{renderTypeBox(prop, classes)}</div>
			</div>
		)
	}
}

function renderName(prop) {
	const { name, tags = {} } = prop
	return <Name deprecated={!!tags.deprecated}>{name}</Name>
}

export function getRowKey(row) {
	return row.name
}

function renderValuesHoc(classes) {
	return function renderValues(prop) {
		return (
			<p className={classes.values}>
				{prop.values
					? prop.values
							.map(v => <Code key={v}>{v}</Code>)
							.reduce((prev, curr) => [prev, ', ', curr])
					: '-'}
			</p>
		)
	}
}

export const columns = (props, classes) => [
	{
		caption: 'Prop name',
		render: renderName,
		className: classes.name
	},
	{
		caption: 'Description',
		render: renderDescription(classes),
		className: classes.description
	},
	...(props.some(p => p.values)
		? [
				{
					caption: 'Values',
					render: renderValuesHoc(classes)
				}
		  ]
		: []),

	{
		caption: 'Default',
		render: renderDefaultHoc(classes)
	},
	...getOriginColumn(props)
]

function PropsRenderer({ props, classes }) {
	return <Table columns={columns(props, classes)} rows={props} getRowKey={getRowKey} />
}

PropsRenderer.propTypes = {
	props: PropTypes.array.isRequired,
	classes: PropTypes.object.isRequired
}

export default Styled(styles)(PropsRenderer)
