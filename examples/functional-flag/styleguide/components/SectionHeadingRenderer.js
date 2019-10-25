import React from 'react';
import PropTypes from 'prop-types';
import cx from 'clsx';
import Heading from 'rsg-components/Heading';
import Styled from 'rsg-components/Styled';
import RsgSectionHeadingRenderer from 'rsg-components-default/SectionHeading/SectionHeadingRenderer';

function SectionHeadingRenderer({ classes, children, toolbar, id, href, depth, deprecated, functional }) {
	const headingLevel = Math.min(6, depth);
	const sectionNameClasses = cx(classes.sectionName, {
		[classes.isDeprecated]: deprecated,
	});

	return (
		<div className={classes.wrapper}>
			<Heading level={headingLevel} id={id}>
				<a href={href} className={cx(sectionNameClasses, functional && classes.functional)}>
					{children}
				</a>
			</Heading>
			<div className={classes.toolbar}>{toolbar}</div>
		</div>
	);
}

const styles = ({ color, space }) => ({
	wrapper: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: space[1],
	},
	toolbar: {
		marginLeft: 'auto',
	},
	sectionName: {
		'&:hover, &:active': {
			isolate: false,
			textDecoration: 'underline',
			cursor: 'pointer',
		},
	},
	isDeprecated: {
		color: color.light,
		'&, &:hover': {
			textDecoration: 'line-through',
		},
	},
	functional:{
		// to make functional components blue
		color: "#00F"
	}
});

SectionHeadingRenderer.propTypes = {
    ...RsgSectionHeadingRenderer.propTypes,
    functional: PropTypes.bool
};

export default Styled(styles)(SectionHeadingRenderer);