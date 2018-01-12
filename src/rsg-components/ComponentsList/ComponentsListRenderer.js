import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Link from 'rsg-components/Link';
import Styled from 'rsg-components/Styled';
import { getUrlNavigation } from '../../utils/utils';

const styles = ({ color, fontFamily, fontSize, space, mq }) => ({
	list: {
		margin: 0,
		paddingLeft: space[2],
	},
	item: {
		color: color.base,
		display: 'block',
		margin: [[space[1], 0, space[1], 0]],
		fontFamily: fontFamily.base,
		fontSize: fontSize.base,
		listStyle: 'none',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	isChild: {
		[mq.small]: {
			display: 'inline-block',
			margin: [[0, space[1], 0, 0]],
		},
	},
	heading: {
		color: color.base,
		marginTop: space[1],
		fontFamily: fontFamily.base,
		fontWeight: 'bold',
	},
});

export function ComponentsListRenderer({ classes, items }, { config }) {
	items = items.filter(item => item.name);

	if (!items.length) {
		return null;
	}
	const navigation = config.navigation;

	return (
		<ul className={classes.list}>
			{items.map(({ heading, name, slug, nameParent, content, level, sections, components }) => (
				<li
					className={cx(classes.item, (!content || !content.props.items.length) && classes.isChild)}
					key={name}
				>
					<Link
						className={cx(heading && classes.heading)}
						href={getUrlNavigation(navigation, {
							slug,
							name,
							nameParent,
							level,
							sections,
							components,
						})}
					>
						{name}
					</Link>
					{content}
				</li>
			))}
		</ul>
	);
}

ComponentsListRenderer.propTypes = {
	items: PropTypes.array.isRequired,
	classes: PropTypes.object.isRequired,
};

ComponentsListRenderer.contextTypes = {
	config: PropTypes.object,
};

export default Styled(styles)(ComponentsListRenderer);
