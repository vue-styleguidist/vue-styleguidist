import React from 'react';
import PropTypes from 'prop-types';
import Group from 'react-group';
import Arguments from 'rsg-components/Arguments';
import Code from 'rsg-components/Code';
import JsDoc from 'rsg-components/JsDoc';
import Markdown from 'rsg-components/Markdown';
import Name from 'rsg-components/Name';
import Type from 'rsg-components/Type';
import Para from 'rsg-components/Para';
import Table from 'rsg-components/Table';
import map from 'lodash/map';
import { unquote, getType, showSpaces } from '../../utils/utils';

function renderType(type) {
	if (!type) {
		return 'unknown';
	}
	let name = type.name;
	const names = type.names;

	if (names) {
		name = names.join('|');
	}
	switch (name) {
		case 'arrayOf':
			return `${type.value.name}[]`;
		case 'objectOf':
			return `{${renderType(type.value)}}`;
		case 'instanceOf':
			return type.value;
		default:
			return name;
	}
}

function renderEnum(prop) {
	if (!Array.isArray(getType(prop).value)) {
		return <span>{getType(prop).value}</span>;
	}

	const values = getType(prop).value.map(({ value }) => (
		<Code key={value}>{showSpaces(unquote(value))}</Code>
	));
	return (
		<span>
			One of:{' '}
			<Group separator=", " inline>
				{values}
			</Group>
		</span>
	);
}

function renderShape(props) {
	const rows = [];
	for (const name in props) {
		const prop = props[name];
		const description = prop.description;
		rows.push(
			<div key={name}>
				<Name>{name}</Name>
				{': '}
				<Type>{renderType(prop)}</Type>
				{description && ' — '}
				{description && <Markdown text={description} inline />}
			</div>
		);
	}
	return rows;
}

function renderDescription(prop) {
	const { description, tags = {} } = prop;
	let { properties } = prop;
	const extra = renderExtra(prop);
	if (Array.isArray(properties)) {
		properties = properties.reduce((total, current) => {
			total.push({
				name: current.name,
				type: {
					name: current.type.names[0],
				},
				description: current.description,
			});
			return total;
		}, []);
	}
	const args = [...(tags.arg || []), ...(tags.argument || []), ...(tags.param || [])];
	return (
		<div>
			{description && <Markdown text={description} />}
			{extra && <Para>{extra}</Para>}
			<JsDoc {...tags} />
			{args && args.length > 0 && <Arguments args={args} heading />}
			{properties && properties.length > 0 && <Arguments args={properties} heading />}
		</div>
	);
}

function renderExtra(prop) {
	const type = getType(prop);

	if (!type) {
		return null;
	}
	switch (type.name) {
		case 'enum':
			return renderEnum(prop);
		case 'union':
			return renderUnion(prop);
		case 'shape':
			return renderShape(prop.type.value);
		case 'arrayOf':
			if (type.value.name === 'shape') {
				return renderShape(prop.type.value.value);
			}
			return null;
		case 'objectOf':
			if (type.value.name === 'shape') {
				return renderShape(prop.type.value.value);
			}
			return null;
		default:
			return null;
	}
}

function renderUnion(prop) {
	if (!Array.isArray(getType(prop).value)) {
		return <span>{getType(prop).value}</span>;
	}

	const values = getType(prop).value.map((value, index) => (
		<Type key={`${value.name}-${index}`}>{renderType(value)}</Type>
	));
	return (
		<span>
			One of type:{' '}
			<Group separator=", " inline>
				{values}
			</Group>
		</span>
	);
}

function renderName(prop) {
	const { name, tags = {} } = prop;
	return <Name deprecated={!!tags.deprecated}>{name}</Name>;
}

function renderTypeColumn(prop) {
	return <Type>{renderType(getType(prop))}</Type>;
}

export function getRowKey(row) {
	return row.name;
}

export function propsToArray(props) {
	return map(props, (prop, name) => ({ ...prop, name }));
}

export const columns = [
	{
		caption: 'Event name',
		render: renderName,
	},
	{
		caption: 'Type',
		render: renderTypeColumn,
	},
	{
		caption: 'Description',
		render: renderDescription,
	},
];

export default function EventsRenderer({ props }) {
	return <Table columns={columns} rows={propsToArray(props)} getRowKey={getRowKey} />;
}

EventsRenderer.propTypes = {
	props: PropTypes.object.isRequired,
};
