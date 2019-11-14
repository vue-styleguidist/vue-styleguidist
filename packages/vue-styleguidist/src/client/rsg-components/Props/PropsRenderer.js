import React from 'react'
import PropTypes from 'prop-types'
import Group from 'react-group'
import Styled from 'rsg-components/Styled'
import Arguments from 'rsg-components/Arguments'
import Argument from 'rsg-components/Argument'
import Code from 'rsg-components/Code'
import JsDoc from 'rsg-components/JsDoc'
import Markdown from 'rsg-components/Markdown'
import Name from 'rsg-components/Name'
import Type from 'rsg-components/Type'
import Text from 'rsg-components/Text'
import Para from 'rsg-components/Para'
import Table from 'rsg-components/Table'
import { unquote, getType, showSpaces } from './util'
import styles from '../../utils/propStyles'

function renderType(type) {
	if (!type) {
		return 'unknown'
	}

	const { name } = type

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

function renderFlowType(type) {
	if (!type) {
		return 'unknown'
	}

	const { name, raw, value } = type

	switch (name) {
		case 'enum':
			return name
		case 'literal':
			return value
		case 'signature':
			return renderComplexType(type.type, raw)
		case 'union':
		case 'tuple':
			return renderComplexType(name, raw)
		default:
			return raw || name
	}
}

function renderComplexType(name, title) {
	return (
		<Text size="small" underlined title={title}>
			<Type>{name}</Type>
		</Text>
	)
}

function renderEnum(prop) {
	if (!Array.isArray(getType(prop).value)) {
		return <span>{getType(prop).value}</span>
	}

	const values = getType(prop).value.map(({ value }) => (
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
// to keep showing those vluei insead of empty, we treat them separaty
const defaultValueBlacklist = ['null', 'undefined', "''", '""']

function renderDefaultHoc(classes) {
	return function renderDefault(prop) {
		return (
			<p className={classes.default}>
				{(() => {
					// Workaround for issue https://github.com/reactjs/react-docgen/issues/221
					// If prop has defaultValue it can not be required
					if (prop.defaultValue) {
						if (prop.type) {
							const propName = prop.type.name

							if (defaultValueBlacklist.indexOf(prop.defaultValue.value) > -1) {
								return <Code>{prop.defaultValue.value}</Code>
							} else if (
								propName === 'func' ||
								propName === 'function' ||
								/^\(\s*\)\s*=>\s*\{/.test(prop.defaultValue.value)
							) {
								return (
									<Text
										size="small"
										color="light"
										underlined
										title={showSpaces(unquote(prop.defaultValue.value))}
									>
										Function
									</Text>
								)
							}
						}

						return (
							<Code>
								{showSpaces(unquote(prop.defaultValue.value.replace(/^\(\s*\)\s*=>\s*/, '')))}
							</Code>
						)
					}
					return '-'
				})()}
			</p>
		)
	}
}

function renderTypeBox(prop, classes) {
	return (
		<Type>
			<pre>
				{prop.flowType ? renderFlowType(getType(prop)) : renderType(getType(prop))}
				{prop.required ? <span className={classes.required}> - required</span> : null}
			</pre>
		</Type>
	)
}

function renderDescription(classes) {
	return function renderDesc(prop) {
		const { description, tags = {} } = prop
		const extra = renderExtra(prop)
		const args = [...(tags.arg || []), ...(tags.argument || []), ...(tags.param || [])]
		const returnDocumentation = (tags.return && tags.return[0]) || (tags.returns && tags.returns[0])

		return (
			<div>
				<div className={classes.descriptionWrapper}>
					{description && <Markdown text={description} />}
				</div>
				{extra && <Para>{extra}</Para>}
				<JsDoc {...tags} />
				{args.length > 0 && <Arguments args={args} heading />}
				{returnDocumentation && <Argument {...returnDocumentation} returns />}
				<div className={classes.type}>{renderTypeBox(prop, classes)}</div>
			</div>
		)
	}
}

function renderExtra(prop) {
	const type = getType(prop)
	if (!type) {
		return null
	}
	switch (type.name) {
		case 'enum':
			return renderEnum(prop)
		case 'union':
			return renderUnion(prop)
		default:
			return null
	}
}

function renderUnion(prop) {
	const type = getType(prop)
	if (!Array.isArray(type.value)) {
		return <span>{type.value}</span>
	}

	const values = type.value.map((value, index) => (
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
	}
]

function PropsRenderer({ props, classes }) {
	return <Table columns={columns(props, classes)} rows={props} getRowKey={getRowKey} />
}

PropsRenderer.propTypes = {
	props: PropTypes.array.isRequired,
	classes: PropTypes.object.isRequired
}

export default Styled(styles)(PropsRenderer)
