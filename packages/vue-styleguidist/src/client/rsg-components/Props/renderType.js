import React from 'react'
import Type from 'rsg-components/Type'
import Text from 'rsg-components/Text'
import { getType } from './util'

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

export default function renderTypeBox(prop, classes) {
	return (
		<Type>
			<pre>
				{prop.flowType ? renderFlowType(getType(prop)) : renderType(getType(prop))}
				{prop.required ? <span className={classes.required}> - required</span> : null}
			</pre>
		</Type>
	)
}
