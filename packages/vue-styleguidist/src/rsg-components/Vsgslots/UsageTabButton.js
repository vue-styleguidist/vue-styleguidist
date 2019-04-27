import React from 'react'
import PropTypes from 'prop-types'
import TabButton from 'rsg-components/TabButton'

const UsageTabButton = props => {
	const component = props.props
	const showButton =
		component.props ||
		(component.methods && component.methods.length > 0) ||
		(component.slots && Object.keys(component.slots).length > 0) ||
		(component.events && Object.keys(component.events).length > 0)
	return showButton ? <TabButton {...props}>Props, methods, events & slots</TabButton> : null
}

UsageTabButton.propTypes = {
	onClick: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	props: PropTypes.shape({
		props: PropTypes.array,
		methods: PropTypes.array
	}).isRequired,
	active: PropTypes.bool
}

export default UsageTabButton
