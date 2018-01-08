import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'rsg-components/Styled';
import SectionHeading from 'rsg-components/SectionHeading';
import Markdown from 'rsg-components/Markdown';

const styles = ({ space }) => ({
	root: {
		marginBottom: space[4],
	},
});

export function SectionRenderer(allProps) {
	const {
		classes,
		name,
		slug,
		content,
		components,
		sections,
		depth,
		description,
		nameParent,
		level,
	} = allProps;

	return (
		<section className={classes.root}>
			{name && (
				<SectionHeading
					nameParent={nameParent}
					name={name}
					level={level}
					depth={depth}
					id={slug}
					slotName="sectionToolbar"
					slotProps={allProps}
				>
					{name}
				</SectionHeading>
			)}
			{description && <Markdown text={description} />}
			{content}
			{components}
			{sections}
		</section>
	);
}

SectionRenderer.propTypes = {
	classes: PropTypes.object.isRequired,
	name: PropTypes.string,
	nameParent: PropTypes.string,
	level: PropTypes.number,
	description: PropTypes.string,
	slug: PropTypes.string,
	content: PropTypes.node,
	components: PropTypes.node,
	sections: PropTypes.node,
	isolated: PropTypes.bool,
	depth: PropTypes.number.isRequired,
};

export default Styled(styles)(SectionRenderer);
