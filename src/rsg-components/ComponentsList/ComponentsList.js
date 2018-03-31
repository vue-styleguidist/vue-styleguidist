import React from 'react';
import ComponentsListRenderer from 'rsg-components/ComponentsList/ComponentsListRenderer';
import PropTypes from 'prop-types';
import { getUrlNavigation } from '../../utils/utils';

function ComponentsList({ classes, items, useIsolatedLinks = false }, { config }) {
	const navigation = config.navigation;
	const mappedItems = items.map(item => ({
		...item,
		href: getUrlNavigation(navigation, {
			name: item.name,
			slug: item.slug,
			nameParent: item.nameParent,
			level: item.level,
			sections: item.sections,
			components: item.components,
			anchor: !useIsolatedLinks,
			isolated: useIsolatedLinks,
		}),
	}));
	return <ComponentsListRenderer classes={classes} items={mappedItems} />;
}

ComponentsList.propTypes = {
	items: PropTypes.array.isRequired,
	classes: PropTypes.object,
	useIsolatedLinks: PropTypes.bool,
};

ComponentsList.contextTypes = {
	config: PropTypes.object,
};

export default ComponentsList;
