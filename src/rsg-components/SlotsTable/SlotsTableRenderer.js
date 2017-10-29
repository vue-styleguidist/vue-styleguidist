import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'rsg-components/Markdown';
import Name from 'rsg-components/Name';
import Table from 'rsg-components/Table';
import map from 'lodash/map';

function renderDescription(prop) {
	const { description } = prop;
	return <div>{description && <Markdown text={description} />}</div>;
}

function renderName(prop) {
	const { name, tags = {} } = prop;
	return <Name deprecated={!!tags.deprecated}>{name}</Name>;
}

export function getRowKey(row) {
	return row.name;
}

export function propsToArray(props) {
	return map(props, (prop, name) => ({ ...prop, name }));
}

export const columns = [
	{
		caption: 'Slot',
		render: renderName,
	},
	{
		caption: 'Description',
		render: renderDescription,
	},
];

export default function SlotsTableRenderer({ props }) {
	return <Table columns={columns} rows={propsToArray(props)} getRowKey={getRowKey} />;
}

SlotsTableRenderer.propTypes = {
	props: PropTypes.object.isRequired,
};
