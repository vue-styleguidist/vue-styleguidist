import React from 'react'
import PropTypes from 'prop-types'
import Props from 'rsg-components/Props'
import Methods from 'rsg-components/Methods'
import Events from 'rsg-components/Events'
import Expose from 'rsg-components/Expose'
import SlotsTable from 'rsg-components/SlotsTable'

export default function Usage({ props: { props, methods, events, slots, expose } }) {
	return (
		<div>
			{props ? <Props props={props} /> : undefined}
			{methods && methods.length > 0 ? <Methods methods={methods} /> : undefined}
			{events && Object.keys(events).length > 0 ? <Events props={events} /> : undefined}
			{slots && Object.keys(slots).length > 0 ? <SlotsTable props={slots} /> : undefined}
      {expose ? <Expose expose={expose} /> : undefined}
		</div>
	)
}

Usage.propTypes = {
	props: PropTypes.shape({
		props: PropTypes.array,
		methods: PropTypes.array,
		expose: PropTypes.array,
		events: PropTypes.object,
		slots: PropTypes.object
	}).isRequired
}
