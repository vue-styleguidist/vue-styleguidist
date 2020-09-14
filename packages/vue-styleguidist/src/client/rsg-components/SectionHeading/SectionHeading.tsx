import React from 'react'
import PropTypes from 'prop-types'
import Slot from 'rsg-components/Slot'
import SectionHeadingRenderer from 'rsg-components/SectionHeading/SectionHeadingRenderer'

const localPropTypes = {
	children: PropTypes.node,
	id: PropTypes.string.isRequired,
	slotName: PropTypes.string.isRequired,
	slotProps: PropTypes.shape({
		isolated: PropTypes.bool.isRequired,
		parentComponent: PropTypes.shape({
			href: PropTypes.string.isRequired,
			visibleName: PropTypes.string.isRequired
		})
	}).isRequired,
	href: PropTypes.string,
	depth: PropTypes.number.isRequired,
	deprecated: PropTypes.bool,
	pagePerSection: PropTypes.bool
}

type SectionHeadingProps = PropTypes.InferProps<typeof localPropTypes>

const SectionHeading: React.FunctionComponent<SectionHeadingProps> = ({
	slotName,
	slotProps,
	children,
	id,
	...rest
}) => {
	const parentHref = slotProps.parentComponent && slotProps.parentComponent.href

	return (
		<SectionHeadingRenderer
			toolbar={slotProps.parentComponent ? null : <Slot name={slotName} props={slotProps} />}
			id={id}
			{...rest}
			parentName={slotProps.parentComponent && slotProps.parentComponent.visibleName}
			parentHref={parentHref}
		>
			{children}
		</SectionHeadingRenderer>
	)
}

SectionHeading.propTypes = localPropTypes

export default SectionHeading
