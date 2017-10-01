import React from 'react';
import PropTypes from 'prop-types';
import Props from 'rsg-components/Props';
import Methods from 'rsg-components/Methods';
import Events from 'rsg-components/Events';

export default function Usage({ props: { props, methods, events } }) {
	const propsNode = props && <Props props={props} />;
	let eventsNode;
	if (events && Object.keys(events).length > 0) {
		eventsNode = events && <Events props={events} />;
	}
	const methodsNode = methods && methods.length > 0 && <Methods methods={methods} />;

	if (!propsNode && !methodsNode) {
		return null;
	}

	return (
		<div>
			{propsNode}
			{methodsNode}
			{eventsNode}
		</div>
	);
}

Usage.propTypes = {
	props: PropTypes.shape({
		props: PropTypes.object,
		methods: PropTypes.array,
		eventsNode: PropTypes.object,
	}).isRequired,
};
