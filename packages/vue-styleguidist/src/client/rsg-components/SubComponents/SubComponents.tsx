import React, { useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import * as Rsg from 'react-styleguidist'
import Link from 'rsg-components/Link'
import Styled, { JssInjectedProps } from 'rsg-components/Styled'

export interface SubComponentsProps {
	subComponents: { name: string; url: string }[]
}

const styles = ({ space, fontFamily }: Rsg.Theme) => ({
	root: {
		isolate: false,
		fontFamily: fontFamily.base,
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		marginBottom: space[3]
	},
	toggler: {
		isolate: false,
		cursor: 'pointer'
	},
	title: {
		isolate: false,
		marginRight: space[1]
	},
	open: {
		isolate: false,
		display: 'flex',
		flexWrap: 'wrap'
	},
	element: {
		// To override the isolation of link we need to wrap
		// this selector
		'$root &': {
			isolate: false,
			marginRight: space[1]
		}
	}
})

export const SubComponents: React.FC<SubComponentsProps & JssInjectedProps> = ({ classes, ...props }) => {
	// only collapse if there is more than 3 requires
	const collapsibleSubComponents = props.subComponents.length > 3
	const [open, setOpen] = useState(!collapsibleSubComponents)
	return (
		<div className={clsx(classes.root, open && classes.open)}>
			<b
				onClick={() => setOpen(!collapsibleSubComponents || !open)}
				className={clsx(classes.title, collapsibleSubComponents && classes.toggler)}
			>
				{collapsibleSubComponents ? (open ? '-' : '+') : ''} Requires
				{collapsibleSubComponents ? ` (${props.subComponents.length})` : ''}
			</b>
			{props.subComponents.map((subComponent, i) => (
				<Link key={i} href={subComponent.url} className={classes.element}>
					{subComponent.name}
				</Link>
			))}
		</div>
	)
}

SubComponents.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	subComponents: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			url: PropTypes.string.isRequired
		}).isRequired
	).isRequired
}

export default Styled<SubComponentsProps & JssInjectedProps>(styles as any)(SubComponents)
