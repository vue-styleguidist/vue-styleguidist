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
	const words = []
	if (!isEmpty(component.props)) {
		words.push('props')
	}
	if (!isEmpty(component.events)) {
		words.push('events')
	}
	if (!isEmpty(component.slots)) {
		words.push('slots')
	}
	if (!isEmpty(component.methods)) {
		words.push('methods')
	}
	const showButton = words.length > 0
	return showButton ? (
		<TabButton {...props}>
			{words.length === 1
				? words[0]
				: `${words.slice(0, -1).join(', ')} & ${words[words.length - 1]}`}
		</TabButton>
	) : null
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
