import React from 'react';
import PropTypes from 'prop-types';
import Slot from 'rsg-components/Slot';
import SectionHeadingRenderer from 'rsg-components/SectionHeading/SectionHeadingRenderer';
import { getUrlNavigation } from '../../utils/utils';

export default function SectionHeading(
	{ slotName, slotProps, children, id, level, name, nameParent, collection = {}, ...rest },
	{ config }
) {
	const navigation = config.navigation;
	const href = getUrlNavigation(navigation, {
		level,
		sections: collection.sections,
		components: collection.components,
		nameParent,
		name,
		slug: id,
		anchor: true,
	});
	return (
		<SectionHeadingRenderer
			toolbar={<Slot name={slotName} props={slotProps} />}
			id={id}
			href={href}
			{...rest}
		>
			{children}
		</SectionHeadingRenderer>
	);
}

SectionHeading.propTypes = {
	children: PropTypes.node,
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	nameParent: PropTypes.string.isRequired,
	level: PropTypes.number.isRequired,
	slotName: PropTypes.string.isRequired,
	slotProps: PropTypes.object.isRequired,
	depth: PropTypes.number.isRequired,
	deprecated: PropTypes.bool,
	collection: PropTypes.object,
};

SectionHeading.contextTypes = {
	config: PropTypes.object,
};
