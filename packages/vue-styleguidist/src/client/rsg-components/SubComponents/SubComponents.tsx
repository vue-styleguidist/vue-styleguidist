import React, { useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import * as Rsg from 'react-styleguidist'
import Styled, { JssInjectedProps } from 'rsg-components/Styled'

export interface SubComponentsProps {
	subComponents: { name: string; url: string }[]
}

const styles = ({ space, fontFamily }: Rsg.Theme) => ({
	requires: {
		isolate: false,
		fontFamily: fontFamily.base,
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		marginBottom: space[3]
	},
	requiresOpen: {
		isolate: false,
		overflow: 'visible',
		whiteSpace: 'normal'
	}
})

export const SubComponents: React.FC<SubComponentsProps & JssInjectedProps> = ({ classes, ...props }) => {
	const [requiresOpen, setOpen] = useState(false)
	return (
		<div className={clsx(classes.requires, requiresOpen && classes.requiresOpen)}>
			<b onClick={() => setOpen(!requiresOpen)}>{requiresOpen ? '-' : '+'} Requires </b>
			{props.subComponents.map((subComponent, i) => (
				<a key={i} href={subComponent.url}>
					{subComponent.name}
				</a>
			))}
		</div>
	)
}

SubComponents.propTypes = {
	subComponents: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			url: PropTypes.string.isRequired
		}).isRequired
	).isRequired
}

export default Styled<SubComponentsProps & JssInjectedProps>(styles as any)(SubComponents)
