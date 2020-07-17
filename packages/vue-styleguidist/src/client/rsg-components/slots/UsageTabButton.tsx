import React from 'react'
import PropTypes from 'prop-types'
import TabButton from 'rsg-components/TabButton'
import isEmpty from 'lodash/isEmpty'
import { PropDescriptor, MethodDescriptor, EventDescriptor, SlotDescriptor } from 'vue-docgen-api'

export interface UsageTabButtonProps {
	name: string
	onClick: (e: React.MouseEvent) => void
	active?: boolean
	props: {
		props?: PropDescriptor[]
		methods?: MethodDescriptor[]
		events?: EventDescriptor[]
		slots?: SlotDescriptor[]
	}
}

const UsageTabButton = (props: UsageTabButtonProps) => {
	const component = props.props
	const showButton =
		!isEmpty(component.props) ||
		!isEmpty(component.methods) ||
		!isEmpty(component.events) ||
		!isEmpty(component.slots)
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
