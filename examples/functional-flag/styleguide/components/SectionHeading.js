import React from 'react';
import PropTypes from 'prop-types';
import RsgSectionHeading from 'rsg-components-default/SectionHeading/SectionHeading';

export default function SectionHeading(opt) {
	return (
		<RsgSectionHeading {...opt}/>
	);
}

SectionHeading.propTypes = {
    ...RsgSectionHeading.propTypes,
    functional: PropTypes.bool
};