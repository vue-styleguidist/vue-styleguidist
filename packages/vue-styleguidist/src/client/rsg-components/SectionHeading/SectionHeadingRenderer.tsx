import React from 'react'
import PropTypes from 'prop-types'
import * as Rsg from 'react-styleguidist'
import cx from 'clsx'
import Heading from 'rsg-components/Heading'
import Styled, { JssInjectedProps } from 'rsg-components/Styled'

const styles = ({ color, space, fontSize }: Rsg.Theme) => ({
	wrapper: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: space[1]
	},
	toolbar: {
		marginLeft: 'auto'
	},
	sectionName: {
		'&:hover, &:active': {
			isolate: false,
			textDecoration: 'underline',
			cursor: 'pointer'
		}
	},
	isDeprecated: {
		color: color.light,
		'&, &:hover': {
			textDecoration: 'line-through'
		}
	},
	parentName: {
		cursor: 'pointer',
		fontSize: fontSize.h5,
		fontStyle: 'italic',
		margin: space[1]
	}
})

const localPropTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	children: PropTypes.node,
	toolbar: PropTypes.node,
	id: PropTypes.string.isRequired,
	href: PropTypes.string,
	depth: PropTypes.number.isRequired,
	deprecated: PropTypes.bool,
	parentName: PropTypes.string,
	parentHref: PropTypes.string
}

type SectionHeadingRendererProps = PropTypes.InferProps<typeof localPropTypes> & JssInjectedProps

const SectionHeadingRenderer: React.FunctionComponent<SectionHeadingRendererProps> = ({
	classes,
	children,
	toolbar,
	id,
	href,
	depth,
	deprecated,
	parentName,
	parentHref
}) => {
	const headingLevel = Math.min(6, depth)
	const sectionNameClasses = cx(classes.sectionName, {
		[classes.isDeprecated]: deprecated
	})

	return (
		<div className={classes.wrapper}>
			<Heading level={headingLevel} id={id}>
				{href ? (
					<a href={href} className={sectionNameClasses}>
						{children}
					</a>
				) : (
					<span className={sectionNameClasses}>{children}</span>
				)}
				{parentName && parentHref && (
					<a href={parentHref} className={classes.parentName}>
						{parentName}
					</a>
				)}
			</Heading>
			<div className={classes.toolbar}>{toolbar}</div>
		</div>
	)
}

SectionHeadingRenderer.propTypes = localPropTypes
export default Styled<SectionHeadingRendererProps>(styles as any)(SectionHeadingRenderer)
