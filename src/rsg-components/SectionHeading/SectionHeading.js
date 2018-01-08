import React from 'react';
import PropTypes from 'prop-types';
import Slot from 'rsg-components/Slot';
import SectionHeadingRenderer from 'rsg-components/SectionHeading/SectionHeadingRenderer';
import getUrl from '../../utils/getUrl';

export default function SectionHeading(
	{ slotName, slotProps, children, id, level, name, nameParent, ...rest },
	{ config }
) {
	let href;
	const navigation = config.navigation;
	if (navigation) {
		if (level < 2) {
			href = getUrl({ name, isolated: true });
		} else {
			href = getUrl({ name: nameParent, id, isolated: true });
		}
	} else {
		href = getUrl({ slug: id, anchor: true });
	}
	return (
		<SectionHeadingRenderer
			toolbar={<Slot name={slotName} props={slotProps} />}
			id={id}
			navigation={navigation}
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
};

SectionHeading.contextTypes = {
	config: PropTypes.object,
};
